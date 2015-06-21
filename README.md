# git-state

Get the current state of any git repository.

[![Build status](https://travis-ci.org/watson/git-state.svg?branch=master)](https://travis-ci.org/watson/git-state)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install git-state
```

## Usage

```js
var gitState = require('git-state')

var path = '/path/to/git/repo'

if (gitState.isGit(path)) {
  gitState.check(path, function (err, result) {
    if (err) throw err
    console.log(result) // => { branch: 'master',
                        //      ahead: 0,
                        //      dirty: 9,
                        //      untracked: 1,
                        //      issues: true }
  })
}
```

## API

#### `isGit(path)`

Returns either `true` or `false` if the given path contains a git
repository.

#### `check(path, callback)`

Will check the state of the git repository at the given `path` and call
the `callback`. The `callback` will be called with two arguments: An
optional error object and a result object.

The result object contains the following properties:

- `branch` - The currently checked out branch
- `ahead` - The amount of commits the current branch is ahead of the
  remote (may be `NaN` if there for instance is no remote)
- `dirty` - The number of dirty files
- `untracked` - The number of untracked files
- `issues` - A generic boolean which is `true` if the repository is in a
  non-clean state (e.g. it's dirty, contains untracked files, is head of
  its remote or is currently not on master)

## License

MIT
