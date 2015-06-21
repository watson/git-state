'use strict'

var test = require('tape')
var git = require('./')

test('#isGit()', function (t) {
  var dir = process.cwd()
  git.isGit(dir, function (exists) {
    t.equal(exists, true)
    t.end()
  })
})

test('#isGitSync()', function (t) {
  var dir = process.cwd()
  var result = git.isGitSync(dir)
  t.equal(result, true)
  t.end()
})

test('#check()', function (t) {
  var dir = process.cwd()
  git.check(dir, function (err, result) {
    t.error(err)
    t.deepEqual(Object.keys(result), ['branch', 'ahead', 'dirty', 'untracked', 'issues'])
    t.equal(typeof result.branch, 'string')
    t.equal(typeof result.ahead, 'number')
    t.equal(typeof result.dirty, 'number')
    t.equal(typeof result.untracked, 'number')
    t.equal(typeof result.issues, 'boolean')
    t.end()
  })
})
