'use strict'

var path = require('path')
var test = require('tape')
var git = require('./')

test('#isGit()', function (t) {
  var dir = process.cwd()
  git.isGit(dir, function (exists) {
    t.equal(exists, true)
    t.end()
  })
})

test('#isGit() negative', function (t) {
  var dir = path.join(process.cwd(), '..')
  git.isGit(dir, function (exists) {
    t.equal(exists, false)
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
    t.deepEqual(Object.keys(result), ['branch', 'ahead', 'dirty', 'untracked', 'stashes'])
    t.equal(typeof result.branch, 'string')
    t.equal(typeof result.ahead, 'number')
    t.equal(typeof result.dirty, 'number')
    t.equal(typeof result.untracked, 'number')
    t.equal(typeof result.stashes, 'number')
    t.end()
  })
})

test('#check() with maxBuffer', function (t) {
  var dir = process.cwd()
  git.check(dir, {maxBuffer: 1}, testMaxBuffer(t))
})

test('#checkSync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.checkSync(dir)
    t.deepEqual(Object.keys(result), ['branch', 'ahead', 'dirty', 'untracked', 'stashes'])
    t.equal(typeof result.branch, 'string')
    t.equal(typeof result.ahead, 'number')
    t.equal(typeof result.dirty, 'number')
    t.equal(typeof result.untracked, 'number')
    t.equal(typeof result.stashes, 'number')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

test('#checkSync() with maxBuffer', function (t) {
  var dir = process.cwd()
  t.throws(function () {
    git.checkSync(dir, {maxBuffer: 1})
  }, /ENOBUFS/)
  t.end()
})

test('#untracked()', function (t) {
  var dir = process.cwd()
  git.untracked(dir, function (err, result) {
    t.error(err)
    t.equal(typeof result, 'number')
    t.end()
  })
})

test('#untracked() with maxBuffer', function (t) {
  var dir = process.cwd()
  git.untracked(dir, {maxBuffer: 1}, testMaxBuffer(t))
})

test('#untrackedSync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.untrackedSync(dir)
    t.equal(typeof result, 'number')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

test('#untrackedSync() with maxBuffer', function (t) {
  var dir = process.cwd()
  t.throws(function () {
    git.untrackedSync(dir, {maxBuffer: 1})
  }, /ENOBUFS/)
  t.end()
})

test('#dirty()', function (t) {
  var dir = process.cwd()
  git.dirty(dir, function (err, result) {
    t.error(err)
    t.equal(typeof result, 'number')
    t.end()
  })
})

test('#dirty() with maxBuffer', function (t) {
  var dir = process.cwd()
  git.dirty(dir, {maxBuffer: 1}, testMaxBuffer(t))
})

test('#dirtySync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.dirtySync(dir)
    t.equal(typeof result, 'number')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

test('#dirtySync() with maxBuffer', function (t) {
  var dir = process.cwd()
  t.throws(function () {
    git.dirtySync(dir, {maxBuffer: 1})
  }, /ENOBUFS/)
  t.end()
})

test('#branch()', function (t) {
  var dir = process.cwd()
  git.branch(dir, function (err, result) {
    t.error(err)
    t.equal(typeof result, 'string')
    t.end()
  })
})

test('#branch() with maxBuffer', function (t) {
  var dir = process.cwd()
  git.branch(dir, {maxBuffer: 1}, testMaxBuffer(t))
})

test('#branchSync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.branchSync(dir)
    t.equal(typeof result, 'string')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

test('#branchSync() with maxBuffer', function (t) {
  var dir = process.cwd()
  t.throws(function () {
    git.branchSync(dir, {maxBuffer: 1})
  }, /ENOBUFS/)
  t.end()
})

test('#ahead()', function (t) {
  var dir = process.cwd()
  git.ahead(dir, function (err, result) {
    t.error(err)
    t.equal(typeof result, 'number')
    t.end()
  })
})

// TODO: Find way to test this as currently none of the buffer is used
// test('#ahead() with maxBuffer', function (t) {
//   var dir = process.cwd()
//   git.ahead(dir, {maxBuffer: 1}, testMaxBuffer(t))
// })

test('#aheadSync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.aheadSync(dir)
    t.equal(typeof result, 'number')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

// TODO: Find way to test this as currently none of the buffer is used
// test('#aheadSync() with maxBuffer', function (t) {
//   var dir = process.cwd()
//   t.throws(function () {
//     git.aheadSync(dir, {maxBuffer: 1})
//   }, /ENOBUFS/)
//   t.end()
// })

test('#commit()', function (t) {
  var dir = process.cwd()
  git.commit(dir, function (err, result) {
    t.error(err)
    t.equal(typeof result, 'string')
    t.end()
  })
})

test('#commit() with maxBuffer', function (t) {
  var dir = process.cwd()
  git.commit(dir, {maxBuffer: 1}, testMaxBuffer(t))
})

test('#commitSync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.commitSync(dir)
    t.equal(typeof result, 'string')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

test('#commitSync() with maxBuffer', function (t) {
  var dir = process.cwd()
  t.throws(function () {
    git.commitSync(dir, {maxBuffer: 1})
  }, /ENOBUFS/)
  t.end()
})

test('#stashes()', function (t) {
  var dir = process.cwd()
  git.stashes(dir, function (err, result) {
    t.error(err)
    t.equal(typeof result, 'number')
    t.end()
  })
})

// TODO: Find way to test this as currently none of the buffer is used
// test('#stashes() with maxBuffer', function (t) {
//   var dir = process.cwd()
//   git.stashes(dir, {maxBuffer: 1}, testMaxBuffer(t))
// })

test('#stashesSync()', function (t) {
  var dir = process.cwd()
  try {
    var result = git.stashesSync(dir)
    t.equal(typeof result, 'number')
  } catch (err) {
    t.error(err)
  }
  t.end()
})

// TODO: Find way to test this as currently none of the buffer is used
// test('#stashesSync() with maxBuffer', function (t) {
//   var dir = process.cwd()
//   t.throws(function () {
//     git.stashesSync(dir, {maxBuffer: 1})
//   }, /ENOBUFS/)
//   t.end()
// })

function testMaxBuffer (t) {
  return function (err) {
    t.ok(err)
    t.equal(err.message, 'stdout maxBuffer exceeded')
    t.end()
  }
}
