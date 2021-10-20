#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';
import fs from 'fs/promises';
import create from '../lib/create.js';

const program = new Command();

let pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), {'encoding': 'utf8'}));

program.version(pkg.version, '-v, --vers', 'output the current version');

program
    .command('create <app-name>' )
    .description('create a new O2OA component')
    .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    .option('-d, --default', 'Skip prompts and use default preset')
    .option('-i, --inlinePreset <json>', 'Skip prompts and use inline JSON string as preset')
    .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-g, --git [message]', 'Force git initialization with initial commit message')
    .option('-n, --no-git', 'Skip git initialization')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .option('--merge', 'Merge target directory if it exists')
    .option('-c, --clone', 'Use git clone when fetching remote preset')
    .option('-x, --proxy <proxyUrl>', 'Use specified proxy when creating project')
    .option('-b, --bare', 'Scaffold project without beginner instructions')
    .option('--skipGetStarted', 'Skip displaying "Get started" instructions')
    .action((name, opts) => {
        create(name, opts); });

program .command('serve')
    .description('Start dev server')
    .action(() => { cmd_delServer(name); });

program.command('build')
    .description('Get Application from server')
    .action((opts) => { cmd_getApplication(opts); });

program.parse(process.argv);

// const options = program.opts();
// console.log(options);
//console.log('Welcome to O2OA developer Cli v'+ pkg.version);