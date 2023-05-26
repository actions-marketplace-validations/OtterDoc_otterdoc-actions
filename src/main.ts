import * as core from '@actions/core'
import {writeFileSync} from 'fs'
import {ProcessFile} from './processFile'
import { VerifyOtterDocKey } from './verify-key'
// import {VerifyOtterDocKey} from './verify-key'


export async function run(): Promise<boolean> {
  console.log('Here we goooooo')

  console.log(`The env key is ${process.env.INPUT_KEY} `)
  try {
    core.warning('Hellooooooo World from Otterdoc!?')

    const key: string = core.getInput('key')
    core.warning(`The loaded key is: ${key} `)
    const files: string = core.getInput('files')
    console.log(`The files var is: ${files} `)
    core.warning(`The files var is: ${files} `)

    if (!(await VerifyOtterDocKey(key))) {
      console.log('Invalid API key')
      core.setFailed('Invalid API key')
      return false
    }

    const filesArray = JSON.parse(files)

    for (const file of filesArray) {
      core.warning(`The file is: ${file} `)
      await ProcessFile(file)
    }

    writeFileSync('foo1.txt', 'This is a test file', 'utf8')
    writeFileSync('foo2.txt', 'This is a test file', 'utf8')

    core.debug('Done!')
  } catch (error) {
    console.log(error)
    if (error instanceof Error) core.setFailed(error.message)
  }
  return true
}

run()
