import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 集成内置对象，会出现自定义类的原型方法拿不到的错误。
    // Object.setPrototypeOf(this, AxiosError.prototype)
  }
}