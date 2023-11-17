import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Commenter } from "./commenter";
import type { InputsType } from "./inputs";
import { defaultInputs } from "./inputs";

async function run(inputs: InputsType) {
  const octokit = getOctokit(inputs.githubToken());

  const commenter = new Commenter({
    octokit,
  });

  if (context.issue.number) {
    await commenter.commentOnItem({
      type: "pull-request",
      identifier: inputs.uniqueIdentifier(),
      message: inputs.message(),
    });
  } else if (context.eventName === "push") {
    await commenter.commentOnItem({
      type: "commit",
      identifier: inputs.uniqueIdentifier(),
      message: inputs.message(),
    });
  }

  core.info("done!");
}

run(defaultInputs).catch((error) => {
  core.setFailed(error.message);
});
