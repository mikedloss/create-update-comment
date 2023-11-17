import * as crypto from "node:crypto";
import { stripIndents } from "common-tags";

export type BuildCommentBodyProps = {
  message: string;
  uniqueCommentIdentifier: string;
};
/**
 * Builds the comment body to post on the Github pull request or commit
 * @returns The comment body
 */
export function buildCommentBody({
  message,
  uniqueCommentIdentifier,
}: BuildCommentBodyProps) {
  const rawGithubComment = stripIndents`
    ${uniqueCommentIdentifier}\n
    ${message}
  `;

  return rawGithubComment;
}

type BuildCommentIdentifierProps = {
  identifier: string;
};
/**
 * Build a unique comment identifier
 * @returns A hidden HTML tag that can be used to identify the comment
 */
export function buildCommentIdentifier({
  identifier,
}: BuildCommentIdentifierProps) {
  const sha256 = crypto.createHash("sha256").update(identifier).digest("hex");
  return `<!-- ${sha256} -->`;
}

type IsEventPullRequestProps = {
  event: string;
};
/**
 * Checks the event type to see if it's a pull request. These start with either
 * `pull_request` or `pull_request_target`
 */
export function isEventPullRequest({ event }: IsEventPullRequestProps) {
  return event.startsWith("pull_request");
}
