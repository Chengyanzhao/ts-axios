import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { transformResponse } from '../helpers/data'
import { AxiosError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', headers, data = null, responseType, timeout } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }
     // [!] 非空断言操作符 能确定变量值一定不为空时使用。 -- from TypeScript 2.0
    request.open(method.toUpperCase(), url!, true)
    request.onreadystatechange = () => {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return
      }
      if (request.status === 0) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      }
      handleResponse(response)
    }
    request.onerror = function handleError() {
      reject(new AxiosError(
        'Network Error',
        config,
        null,
        request,
      ))
    }
    request.ontimeout = function handleTimeout() {
      reject(new AxiosError(
        `Timeout of ${timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request,
      ))
    }
    setHeaders(headers, request)
    request.send(data)

    function setHeaders(headers: any, request: XMLHttpRequest) {
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          const value = headers[name]
          request.setRequestHeader(name, value)
        }
      })
    }
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${response.status}`))
        reject(new AxiosError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ))
      }
    }
  })
}
