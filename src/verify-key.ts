import * as core from '@actions/core'

export async function VerifyOtterDocKey(key: string) {
  const result = await fetch(
    `https://www.otterdoc.ai/api/verify-key?key=${key}`
  )

  if (result.status === 200) {
    return true
  } else {
    return false
  }
}
