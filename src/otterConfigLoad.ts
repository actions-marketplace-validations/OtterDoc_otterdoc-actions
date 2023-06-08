import * as fs from 'fs'

interface Config {
  debug: boolean
}

const loadConfig = (): Config => {
  const defaultConfig: Config = {
    debug: false
  }

  try {
    const rawData = fs.readFileSync('./otterconfig.json', 'utf8')
    const parsedConfig = JSON.parse(rawData) as Partial<Config>
    return {...defaultConfig, ...parsedConfig}
  } catch (error) {
    return defaultConfig
  }
}

export default loadConfig()
