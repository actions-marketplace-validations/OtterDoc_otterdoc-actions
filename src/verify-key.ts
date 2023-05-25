import * as core from '@actions/core'

export async function VerifyOtterDocKey(key: string) {
  const result = await fetch(
    `https://www.otterdoc.ai/api/verify-key?key=${key}`
  )

  if (result.status === 200) {
    core.warning('Key is valid')
    return true
  } else {
    core.warning('Key is invalid')
    core.warning(`Verify status code: ${result.status}`)
    return false
  }
}
