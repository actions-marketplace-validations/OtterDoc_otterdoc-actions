import * as core from '@actions/core'
import { writeFileSync } from 'fs'
import { VerifyOtterDocKey } from './verify-key'
// import {wait} from './wait'

async function run(): Promise<void> {
  try {
    core.warning('Hellooooooo World from Otterdoc!?')

    const key: string = core.getInput('key')
    core.warning(`The loaded key is: ${key} `)
    const files: string = core.getInput('files')
    core.warning(`The files key is: ${files} `)

    if (!(await VerifyOtterDocKey(key))) {
      core.setFailed('Invalid API key')
      return
    }

    const filesArray = JSON.parse(files)

    filesArray.forEach((file: string, index: number) => {
      core.warning(`${index} The file is: ${file} `)
    })

    writeFileSync('foo1.txt', 'This is a test file', 'utf8')
    writeFileSync('foo2.txt', 'This is a test file', 'utf8')

    core.debug('Done!')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
