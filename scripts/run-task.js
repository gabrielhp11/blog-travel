/** Run the project's Node-only npm tasks with the current Node executable. */
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

function runTask(name, {cwd = process.cwd(), stdio = 'inherit'} = {}) {
  const {scripts} = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  if (!Object.hasOwn(scripts, name)) throw new Error(`Unknown task: ${name}`);
  for (const command of scripts[name].split(/\s*&&\s*/)) {
    const [executable, ...args] = command.trim().split(/\s+/);
    if (executable !== 'node') throw new Error(`Task ${name} must contain only Node commands`);
    execFileSync(process.execPath, args, {cwd, stdio});
  }
}

module.exports = {runTask};
if (require.main === module) {
  try {
    if (process.argv.length < 3) throw new Error('Usage: node scripts/run-task.js <task> [task ...]');
    for (const name of process.argv.slice(2)) {
      console.log(`Running ${name}`);
      runTask(name);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = error.status || 1;
  }
}
