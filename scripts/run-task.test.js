const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {runTask} = require('./run-task');

test('tasks use the current Node without npm or a shell and stop on failure', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pokisky-task-'));
  try {
    fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({scripts: {
      success: 'node first.js && node second.js',
      failure: 'node fail.js && node second.js',
      unsafe: 'npm install'
    }}));
    fs.writeFileSync(path.join(cwd, 'first.js'), "require('node:fs').writeFileSync('result', 'first');");
    fs.writeFileSync(path.join(cwd, 'second.js'), "require('node:fs').appendFileSync('result', '-second');");
    fs.writeFileSync(path.join(cwd, 'fail.js'), 'process.exit(7);');
    runTask('success', {cwd, stdio:'pipe'});
    assert.equal(fs.readFileSync(path.join(cwd, 'result'), 'utf8'), 'first-second');
    assert.throws(() => runTask('failure', {cwd, stdio:'pipe'}), error => error.status === 7);
    assert.equal(fs.readFileSync(path.join(cwd, 'result'), 'utf8'), 'first-second');
    assert.throws(() => runTask('missing', {cwd}), /Unknown task/);
    assert.throws(() => runTask('unsafe', {cwd}), /only Node commands/);
  } finally {
    fs.rmSync(cwd, {recursive:true, force:true});
  }
});
