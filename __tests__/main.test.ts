import * as path from 'path'
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import {expect, test} from '@jest/globals'

import {run} from '../src/main'

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', async () => {
  process.env['INPUT_FILES'] = '["src/sample.ts"]'
  // const np = process.execPath
  // const ip = path.join(__dirname, '..', 'lib', 'main.js')
  // const options: cp.ExecFileSyncOptions = {
  //   env: process.env,
  //   stdio: 'inherit'
  // }
  // console.log(cp.execFileSync(np, [ip], options))

  await run()
})
