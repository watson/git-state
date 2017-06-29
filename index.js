'use strict'

var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec
var execSync = require('child_process').execSync
var afterAll = require('after-all-results')

// Prevent from failing on windows
var nullPath = /^win/.test(process.platform) ? 'nul' : '/dev/null'

// Consider EOL as \n because either Windows or *nix, this escape char will be there
var EOL = /\r?\n/

exports.isGit = function isGit (dir, cb) {
  fs.stat(path.join(dir, '.git'), function (err) {
    cb(!err) // eslint-disable-line standard/no-callback-literal
  })
}

exports.isGitSync = function isGitSync (dir) {
  return fs.existsSync(path.join(dir, '.git'))
}

exports.checkSync = function checkSync (repo, opts) {
  var branch = exports.branchSync(repo, opts)
  var ahead = exports.aheadSync(repo, opts)
  var status = statusSync(repo, opts)
  var stashes = exports.stashesSync(repo, opts)

  return {
    branch: branch,
    ahead: ahead,
    dirty: status.dirty,
    untracked: status.untracked,
    stashes: stashes
  }
}

exports.check = function check (repo, opts, cb) {
  if (typeof opts === 'function') return exports.check(repo, {}, opts)

  var next = afterAll(function (err, results) {
    if (err) return cb(err)

    var branch = results[0]
    var ahead = results[1]
    var stashes = results[2]
    var status = results[3]

    cb(null, {
      branch: branch,
      ahead: ahead,
      dirty: status.dirty,
      untracked: status.untracked,
      stashes: stashes
    })
  })

  exports.branch(repo, opts, next())
  exports.ahead(repo, opts, next())
  exports.stashes(repo, opts, next())

  status(repo, opts, next())
}

exports.untracked = function untracked (repo, opts, cb) {
  if (typeof opts === 'function') return exports.untracked(repo, {}, opts)

  status(repo, opts, function (err, result) {
    if (err) return cb(err)
    cb(null, result.untracked)
  })
}

exports.dirty = function dirty (repo, opts, cb) {
  if (typeof opts === 'function') return exports.dirty(repo, {}, opts)

  status(repo, opts, function (err, result) {
    if (err) return cb(err)
    cb(null, result.dirty)
  })
}

exports.branch = function branch (repo, opts, cb) {
  if (typeof opts === 'function') return exports.branch(repo, {}, opts)
  opts = opts || {}

  exec('git show-ref >' + nullPath + ' 2>&1 && git rev-parse --abbrev-ref HEAD', {cwd: repo, maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
    if (err) {
      if (err.message === 'stdout maxBuffer exceeded') return cb(err)
      return cb() // most likely the git repo doesn't have any commits yet
    }
    cb(null, stdout.trim())
  })
}

exports.ahead = function ahead (repo, opts, cb) {
  if (typeof opts === 'function') return exports.ahead(repo, {}, opts)
  opts = opts || {}

  exec('git show-ref >' + nullPath + ' 2>&1 && git rev-list HEAD --not --remotes', {cwd: repo, maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
    if (err) {
      if (err.message === 'stdout maxBuffer exceeded') return cb(err)
      return cb(null, NaN) // depending on the state of the git repo, the command might return non-0 exit code
    }
    stdout = stdout.trim()
    cb(null, !stdout ? 0 : parseInt(stdout.split(EOL).length, 10))
  })
}

function status (repo, opts, cb) {
  opts = opts || {}
  exec('git status -s', {cwd: repo, maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
    if (err) return cb(err)
    var status = { dirty: 0, untracked: 0 }
    stdout.trim().split(EOL).filter(truthy).forEach(function (file) {
      if (file.substr(0, 2) === '??') status.untracked++
      else status.dirty++
    })
    cb(null, status)
  })
}

function truthy (obj) {
  return !!obj
}

exports.commit = function commit (repo, opts, cb) {
  if (typeof opts === 'function') return exports.commit(repo, {}, opts)
  opts = opts || {}

  exec('git rev-parse --short HEAD', {cwd: repo, maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
    if (err) return cb(err)
    var commitHash = stdout.trim()
    cb(null, commitHash)
  })
}

exports.stashes = function stashes (repo, opts, cb) {
  if (typeof opts === 'function') return exports.stashes(repo, {}, opts)
  opts = opts || {}

  exec('git stash list', {cwd: repo, maxBuffer: opts.maxBuffer}, function (err, stdout, stderr) {
    if (err) return cb(err)
    var stashes = stdout.trim().split(EOL).filter(truthy)
    cb(null, stashes.length)
  })
}

//* SYNC methods *//
exports.untrackedSync = function untrackedSync (repo, opts) {
  return statusSync(repo, opts).untracked
}

exports.dirtySync = function dirtySync (repo, opts) {
  return statusSync(repo, opts).dirty
}

exports.branchSync = function branchSync (repo, opts) {
  opts = opts || {}
  try {
    var stdout = execSync('git show-ref >' + nullPath + ' 2>&1 && git rev-parse --abbrev-ref HEAD', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
    return stdout.trim()
  } catch (err) {
    if (err.code === 'ENOBUFS') throw err
    return null // most likely the git repo doesn't have any commits yet
  }
}

exports.aheadSync = function aheadSync (repo, opts) {
  opts = opts || {}
  try {
    var stdout = execSync('git show-ref >' + nullPath + ' 2>&1 && git rev-list HEAD --not --remotes', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
    stdout = stdout.trim()
    return !stdout ? 0 : parseInt(stdout.split(EOL).length, 10)
  } catch (err) {
    if (err.code === 'ENOBUFS') throw err
    return NaN
  }
}

// Throws error
var statusSync = function statusSync (repo, opts) {
  opts = opts || {}
  var stdout = execSync('git status -s', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
  var status = { dirty: 0, untracked: 0 }
  stdout.trim().split(EOL).filter(truthy).forEach(function (file) {
    if (file.substr(0, 2) === '??') status.untracked++
    else status.dirty++
  })
  return status
}

// Throws error
exports.commitSync = function commitSync (repo, opts) {
  opts = opts || {}
  var stdout = execSync('git rev-parse --short HEAD', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
  var commitHash = stdout.trim()
  return commitHash
}

// Throws error
exports.stashesSync = function stashesSync (repo, opts) {
  opts = opts || {}
  var stdout = execSync('git stash list', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
  var stashes = stdout.trim().split(EOL).filter(truthy)
  return stashes.length
}
