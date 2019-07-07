import { AxiosRequestConfig } from "../types"
import { isPlainObject, deepMerge } from '../helpers/util'

const strats = Object.create(null)

function defaultStrat(value1: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : value1
}
function fromVal2strat(val1: any, val2: 2): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2strat
})
const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

/**
 * 
 * @param config1 默认配置
 * @param config2 传入配置
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}