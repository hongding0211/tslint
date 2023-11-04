#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk')

const getOutput = require('./utils/getOutput.js');
const parseLine = require('./utils/parseLine.js');
const tscFiles = require('./utils/tscFiles.js')
const parseJscOutput = require('./utils/parseJscOutput.js')

const TSLINT_CONFIG_FILE_NAME = 'tslintconfig.js'
const TSC_OUTPUT_FILE_NAME = `tsc_output_${Date.now()}.json`;

const args = process.argv;
const inputFiles = args.slice(2);

// read js if file exists
let config = undefined
if (fs.existsSync(TSLINT_CONFIG_FILE_NAME)) {
  config = require(`${process.cwd()}/${TSLINT_CONFIG_FILE_NAME}`)
}

// run tsc first
const runTsc = tscFiles(inputFiles, TSC_OUTPUT_FILE_NAME)
// if tsc exit with 0, than do nothing
if (runTsc === 0) {
  process.exit(0)
}

// read tsc output from file
const tscOutput = JSON.parse(fs.readFileSync(TSC_OUTPUT_FILE_NAME).toString())
// remove tsc output file
fs.unlinkSync(TSC_OUTPUT_FILE_NAME)

const parsedOutput = parseJscOutput(tscOutput, inputFiles, config?.ignore || [])

// if there is no error, than exist with 0
if (!Array.isArray(parsedOutput) || parsedOutput.length === 0) {
  console.log(chalk.bold.bgGreen('Typescript checked passed.'))
  console.log(chalk.bold.green(`Found 0 error in ${inputFiles.length} file(s).`))
  process.exit(0)
}

// group by outputs based on input files
const groupedOutput = {}
parsedOutput.forEach(e => {
  if (groupedOutput[e.file] === undefined) {
    groupedOutput[e.file] = []
  }
  groupedOutput[e.file].push(e)
})

for (const [k, v] of Object.entries(groupedOutput)) {
  const fileBuff = fs.readFileSync(k).toString()
  console.log(chalk.underline.bold(k))
  for (const err of v) {
    const meta = parseLine(fileBuff, err.start, err.length)
    console.log(getOutput(err.messageText, meta))
    console.log(chalk.hidden(k))
  }
  console.log()
}

// summary
console.log(chalk.bold.bgRed(`Typescript checked failed.`))
console.log(chalk.bold.red(`Found ${parsedOutput.length} error(s) in ${Object.keys(groupedOutput).length} file(s).\r\n\r\n`))

process.exit(1)