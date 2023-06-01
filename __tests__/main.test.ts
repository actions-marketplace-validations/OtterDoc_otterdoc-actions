import * as path from 'path'
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

import { test } from '@jest/globals'
import * as process from 'process'

import { RunActionStep } from '../src/RunActionStep'

// test('throws invalid number', async () => {
//   const input = parseInt('foo', 10)
//   await expect(wait(input)).rejects.toThrow('milliseconds not a number')
// })

// test('wait 500 ms', async () => {
//   const start = new Date()
//   await wait(500)
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', async () => {
  console.log(`Running the test!`)
  process.env['GITHUB_WORKSPACE'] = path.join(__dirname, '../samples')
  console.log(`Working in repo at: ${process.env['GITHUB_WORKSPACE']}`)
  // const np = process.execPath
  // const ip = path.join(__dirname, '..', 'lib', 'main.js')
  // const options: cp.ExecFileSyncOptions = {
  //   env: process.env,
  //   stdio: 'inherit'
  // }
  // console.log(cp.execFileSync(np, [ip], options))

  await RunActionStep()
}, 100000)
