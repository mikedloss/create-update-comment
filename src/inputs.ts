import * as core from "@actions/core";

export type InputsType = {
  uniqueIdentifier(): string;
  githubToken(): string;
  message(): string;
};

// github token
// comment identifier
// message

export const defaultInputs: InputsType = {
  uniqueIdentifier(): string {
    return core.getInput("unique-identifier", { required: true });
  },
  githubToken(): string {
    return core.getInput("token", { required: true });
  },
  message(): string {
    return core.getInput("message", { required: true });
  },
};
