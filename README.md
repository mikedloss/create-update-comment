# Create or Update Comment

Simple GH action that will comment on a pull request with a message you want.

## Inputs

### `token`

**Required** The GitHub token to use to comment on the pull request.

### `unique-identifier`

**Required** A unique identifier for the comment the bot will make. This is
hidden with `<!-- -->` so it won't be visible to users. This is used to update
the comment if it already exists.

### `message`

**Required** The message you want to comment on the pull request or commit.

## Example usage

```yaml
uses: mikedloss/create-update-comment@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  unique-identifier: "my-unique-identifier"
  message: |
    This is a multi-line message.
    It will be formatted as markdown.
```
