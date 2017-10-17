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
var git = require('git-state')

var path = '/path/to/git/repo'

git.isGit(path, function (exists) {
  if (!exists) return

  git.check(path, function (err, result) {
    if (err) throw err
    console.log(result) // => { branch: 'master',
                        //      ahead: 0,
                        //      dirty: 9,
                        //      untracked: 1,
                        //      stashes: 0 }
  })
})
```

## API

#### `isGit(path, callback)`

Calls the `callback` with a boolean which is either `true` or `false`
depending on if the given path contains a git repository.

#### `isGitSync(path)`

Synchronous version of `isGit()` which returns either `true` or `false`
depending on if the given path contains a git repository.

#### `check(path[, options], callback)`

Will check the state of the git repository at the given `path` and call
the `callback`. The `callback` will be called with two arguments: An
optional error object and a result object.

The result object contains the following properties:

- `branch` - The currently checked out branch
- `remoteBranch` - The remote tracking branch of the currently checked out branch
- `ahead` - The amount of commits the current branch is ahead of the remote (may be `NaN` if there for instance is no remote)
- `behind` - The amount of commits the current branch is behind of the remote (may be `NaN` if there for instance is no remote)
- `dirty` - The number of dirty files
- `untracked` - The number of untracked files
- `stashes` - The number of stored stashes

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `checkSync(path[, options])`

Synchronous version of `check()`. 

Can throw error. This typically happens if you are running a too old 
version of Node.js (< 0.12), if git isnt found or if the path isn't 
a git repository.

#### `untracked(path[, options], callback)`

Get the amount of untracked files in the git repository at the given
`path`.

The `callback` will be called with two arguments: An optional error
object and a number representing the amount of untracked files.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `untrackedSync(path[, options])`

Synchronous version of `untracked()`. 

Can throw error. This typically happens if you are running a too old 
version of Node.js (< 0.12), if git isnt found or if the path isn't 
a git repository.

#### `dirty(path[, options], callback)`

Get the amount of dirty files in the git repository at the given
`path`.

The `callback` will be called with two arguments: An optional error
object and a number representing the amount of dirty files.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `dirtySync(path[, options])`

Synchronous version of `dirty() `. 

Can throw error. This typically happens if you are running a too old 
version of Node.js (< 0.12), if git isnt found or if the path isn't 
a git repository.

#### `branch(path[, options], callback)`

Get the currently checked out branch in the git repository at the given
`path`.

The `callback` will be called with two arguments: An optional error
object and a string with the branch name.

If the branch name cannot be found, a falsy value will be returned.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `branchSync(path[, options])`

Synchronous version of `branch()`. Returns null if no branch is set.

#### `remoteBranch(path[, options], callback)`

Get the remote for the currently checked out branch in the git 
repository at the given `path`.

The `callback` will be called with two arguments: An optional error
object and a string with the remote name.

If the branch name cannot be found, a falsy value will be returned.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `remoteBranchSync(path[, options])`

Synchronous version of `remoteBranch()`. Returns null if no branch is set.

#### `ahead(path[, options], callback)`

Get the amount of commits the current branch in the git repository at
the given `path` is ahead of its remote.

The `callback` will be called with two arguments: An optional error
object and a number indicating the amount of commits the branch is ahead
of its remote.

If the number cannot be determined, `NaN` will be returned instead.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `aheadSync(path[, options])`

Synchronous version of `ahead()`.

If the number cannot be determined, `NaN` will be returned instead.

#### `behind(path[, options], callback)`

Get the amount of commits the current branch in the git repository at
the given `path` is behind of its remote.

The `callback` will be called with two arguments: An optional error
object and a number indicating the amount of commits the branch is behind
of its remote.

If the number cannot be determined, `NaN` will be returned instead.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `behindSync(path[, options])`

Synchronous version of `behind()`.

If the number cannot be determined, `NaN` will be returned instead.

#### `commit(path[, options], callback)`

Get the short-hash (e.g. `7b0a3ab`) for the latest commit at `HEAD` in
the git repository at the given `path`.

The `callback` will be called with two arguments: An optional error
object and a string containing the short-hash.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `commitSync(path[, options])`

Synchronous version of `commit()`. 

Can throw error. This typically happens if you are running a too old 
version of Node.js (< 0.12), if git isnt found or if the path isn't 
a git repository.

#### `stashes(path[, options], callback)`

Get the amount of stashed changes in the git repository at the given
`path`.

The `callback` will be called with two arguments: An optional error
object and a number representing the amount of stashed changes.

Supports the following `options`:

- `maxBuffer` - largest amount of data (in bytes) allowed on stdout or
  stderr - if exceeded child process is killed (default: `200*1024`)

#### `stashesSync(path[, options])`

Synchronous version of `stashes()`. 

Can throw error. This typically happens if you are running a too old 
version of Node.js (< 0.12), if git isnt found or if the path isn't 
a git repository.

## Shell implementation

Inside the [`bin`](https://github.com/watson/git-state/tree/master/bin)
folder is a set of shell scripts which will perform the same checks as
the `isGit()` and `check()` functions, but just in pure bash. This
allows you for instance to modify your command prompt without having to
invoke node (which can be kind of slow if done at every request). In
fact this is exactly what the
[git-ps1](https://github.com/watson/git-ps1) module does for you.

- `bin/isgit` - exit code will be 0 if cwd is inside a git repo,
  otherwise 1
- `bin/ahead` - exit code will be 0 if result is `0`, otherwise 1
- `bin/branch` - exit code will be 0 if result is `master`, otherwise 1
- `bin/dirty` - exit code will be 0 if result is `0`, otherwise 1
- `bin/untracked` - exit code will be 0 if result is `0`, otherwise 1
- `bin/stashes` - exit code will be 0 if result is `0`, otherwise 1
- `bin/commit` - exit code will be 0 if a commit can be found, otherwise 1

## License

MIT
