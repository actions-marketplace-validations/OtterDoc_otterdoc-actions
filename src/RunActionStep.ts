import * as core from '@actions/core'
import { documentRepo } from './documentJob/repoCrawl'
import { VerifyOtterDocKey } from './verify-key'
import {config as dotenvConfig} from 'dotenv'
dotenvConfig()

export async function RunActionStep(): Promise<boolean> {
  console.log('Here we goooooo')

  console.log(`The env key is ${process.env.INPUT_KEY} `)
  console.log(`The current path is: '${__dirname}'`)
  console.log(
    `The code was checked out under: '${process.env.GITHUB_WORKSPACE}'`
  )
  try {
    core.warning('Hellooooooo World from Otterdoc!?')

    const key: string = core.getInput('key')
    core.warning(`The loaded key is: ${key} `)

    if (!(await VerifyOtterDocKey(key))) {
      console.log('Invalid API key')
      core.setFailed('Invalid API key')
      return false
    }

    await documentRepo(process.env.GITHUB_WORKSPACE || __dirname)

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
  console.log("Exit RunActionStep()")
  return true
}