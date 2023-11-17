import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import {
  buildCommentBody,
  buildCommentIdentifier,
  isEventPullRequest,
} from "./helpers";

type Octokit = ReturnType<typeof getOctokit>;

type CommenterInputs = {
  octokit: Octokit;
};

type FindPreviewCommentProps = {
  text: string;
  octokit: Octokit;
};

type FindCommentsByEventProps = {
  octokit: Octokit;
};

type SharedCommentOnThingProps = {
  identifier: string;
  message: string;
  type: "commit" | "pull-request";
};

export class Commenter {
  octokit: Octokit;

  constructor(props: CommenterInputs) {
    this.octokit = props.octokit;
  }

  async commentOnItem({
    identifier,
    message,
    type,
  }: SharedCommentOnThingProps) {
    const uniqueCommentIdentifier = buildCommentIdentifier({
      identifier: `${type}-${identifier}`,
    });
    const commentId = await this.findPreviousComment({
      octokit: this.octokit,
      text: uniqueCommentIdentifier,
    });

    const body = buildCommentBody({
      message,
      uniqueCommentIdentifier,
    });

    if (type === "pull-request") {
      if (commentId) {
        await this.octokit.rest.issues.updateComment({
          ...context.repo,
          comment_id: commentId,
          body,
        });
      } else {
        await this.octokit.rest.issues.createComment({
          ...context.repo,
          issue_number: context.issue.number,
          body,
        });
      }
    } else {
      if (commentId) {
        await this.octokit.rest.repos.updateCommitComment({
          ...context.repo,
          comment_id: commentId,
          body,
        });
      } else {
        await this.octokit.rest.repos.createCommitComment({
          ...context.repo,
          commit_sha: context.sha,
          body,
        });
      }
    }
  }

  private async findPreviousComment({
    octokit,
    text,
  }: FindPreviewCommentProps) {
    const { data: comments } = await this.findCommentsByEvent({ octokit });

    if (comments.length === 0) {
      core.debug(
        `findPreviousComment: No comments found when searching by event`,
      );
      return null;
    }

    const vercelPreviewUrlComment = comments.find((comment) =>
      comment.body?.startsWith(text),
    );

    if (vercelPreviewUrlComment) {
      core.debug(
        `findPreviousComment: Found the previous comment - ${vercelPreviewUrlComment}`,
      );
      return vercelPreviewUrlComment.id;
    }
    core.debug(`findPreviousComment: Did not find the previous comment`);
    return null;
  }

  private async findCommentsByEvent({ octokit }: FindCommentsByEventProps) {
    core.debug(`findCommentsByEvent: eventName -> "${context.eventName}"`);
    if (isEventPullRequest({ event: context.eventName })) {
      return octokit.rest.issues.listComments({
        ...context.repo,
        issue_number: context.issue.number,
      });
    }
    if (context.eventName === "push") {
      return octokit.rest.repos.listCommentsForCommit({
        ...context.repo,
        commit_sha: context.sha,
      });
    }
    core.error("findCommentsByEvent: eventName not supported");
    return { data: [] };
  }
}
