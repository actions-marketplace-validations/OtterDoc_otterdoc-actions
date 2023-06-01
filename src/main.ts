import * as core from '@actions/core'
import {CommentFile} from './processFile'
import {VerifyOtterDocKey} from './verify-key'
import { documentRepo } from './GatherFiles'
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

    await documentRepo()

    // const updatedFiles = filesArray.map(async (file: string) => {
    //   core.warning(`The file is: ${file} `)
    //   return CommentFile(file)
    // })

    // await   Promise.all(updatedFiles)

    core.debug('Done!')
  } catch (error) {
    console.log(error)
    if (error instanceof Error) core.setFailed(error.message)
  }
  return true
}

run()
