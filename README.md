# cz-conventional-clubhouse

An adapter for commitizen that follows the
[angular commit standard](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-angular/convention.md).
Initially forked from [commitizen/cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog) this version provides
additional questions intended to help aid users of clubhouse.io.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Features

This adapter adds 2 features to commitizen/cz-conventional-changelog:

* The ability to link the branch the commit is on to a clubhouse.io story via:
  `[branch ch<STORYNUMBER>]`
* The ability to likk the specific commit to a clubhouse.io story via:
  `[ch<STORYNUMBER>]`

Both of these are questions asked after the commit information has been added. A
user only needs to know the story number to link the story. The clubhouse.io
specific syntax is added for you. Multiple stories can be added by comma
seperating the response.

## Usage

Use as any commitizen adapter by setting `path` in your `package.json`
commitizen config:

```json
"config": {
  "commitizen": {
    "path": "cz-conventional-clubhouse"
  }
}
```
