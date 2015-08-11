'use strict'

var os = require('os')
var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec
var afterAll = require('after-all-results')

var VALID_BRANCHES = ['master', 'gh-pages']

exports.isGit = function (dir, cb) {
  fs.exists(path.join(dir, '.git'), cb)
}

exports.isGitSync = function (dir) {
  return fs.existsSync(path.join(dir, '.git'))
}

exports.check = function (repo, cb) {
  var next = afterAll(function (err, results) {
    if (err) return cb(err)

    var branch = results[0]
    var ahead = results[1]
    var status = results[2]
    var issues = Boolean(!~VALID_BRANCHES.indexOf(branch) ||
                         ahead || Number.isNaN(ahead) ||
                         status.dirty || status.untracked)

    cb(null, {
      branch: branch,
      ahead: ahead,
      dirty: status.dirty,
      untracked: status.untracked,
      issues: issues
    })
  })

  branch(repo, next())
  ahead(repo, next())
  status(repo, next())
}

var status = function (repo, cb) {
  exec('git status -s', { cwd: repo }, function (err, stdout, stderr) {
    if (err) return cb(err)
    var status = { dirty: 0, untracked: 0 }
    stdout.trim().split(os.EOL).filter(truthy).forEach(function (file) {
      if (file.substr(0, 2) === '??') status.untracked++
      else status.dirty++
    })
    cb(null, status)
  })
}

var branch = function (repo, cb) {
  exec('git show-ref &> /dev/null && git rev-parse --abbrev-ref HEAD', { cwd: repo }, function (err, stdout, stderr) {
    if (err) return cb() // most likely the git repo doesn't have any commits yet
    cb(null, stdout.trim())
  })
}

var ahead = function (repo, cb) {
  exec('git show-ref &> /dev/null && git rev-list HEAD --not --remotes', { cwd: repo }, function (err, stdout, stderr) {
    if (err) return cb(null, NaN) // depending on the state of the git repo, the command might return non-0 exit code
    stdout = stdout.trim()
    cb(null, !stdout ? 0 : parseInt(stdout.split(os.EOL).length, 10))
  })
}

var truthy = function (obj) {
  return !!obj
}
