import * as core from '@actions/core'
import {readFileSync, writeFileSync} from 'fs'
// import {wait} from './wait'

async function run(): Promise<void> {
  try {
    core.warning('Hellooooooo World from Otterdoc!?')
    
    const key: string = core.getInput('key')
    core.warning(`The loaded key is: ${key} `)

    core.warning(
      `Here is where the file manifest is: ${process.env.HOME}/files.json `
    )

    const filesString = readFileSync(`${process.env.HOME}/files.json`, 'utf8')
    core.warning(`Here are the files: ${filesString} `)

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())

    writeFileSync('foo1.txt', 'This is a test file', 'utf8')
    writeFileSync('foo2.txt', 'This is a test file', 'utf8')

    core.debug('Done!')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
