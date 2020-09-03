const requestCallbackQueue = []

const responseCallbackQueue = []

// 请求拦截器
export const requestInterceptor = requestCallback => {
  requestCallbackQueue.push(requestCallback)
}

// 响应拦截器
export const responseInterceptor = responseCallback => {
  responseCallbackQueue.push(responseCallback)
}

const fetchPro = async (uri, options) => {
  let newOptions = {...options}
  // 遍历请求拦截器队列
  requestCallbackQueue.forEach(requestCallback => {
    newOptions = requestCallback({...options})
  })
  
  // 发送请求
  let result = fetch(uri, newOptions)

  let responseData = {}
  // 请求数据
  await result.then((response) => {
    response.data = response.json()
    responseData = response
  })
  // 遍历响应拦截器队列
  responseCallbackQueue.forEach(responseCallback => {
    responseCallback(responseData)
  })

  return fetch(uri, newOptions)
}

export default fetchPro