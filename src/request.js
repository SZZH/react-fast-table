import { notification } from 'antd'
import fetchPro, { requestInterceptor, responseInterceptor } from './fetchPro'
import { CodepenCircleFilled } from '@ant-design/icons';
let headers = {}

// 状态码
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 状态码检查
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}`,
    description: errortext,
  });
  // const error = new Error(errortext);
  // error.name = response.status
  // error.response = response
  // throw error
}

// 请求拦截器
requestInterceptor(config => {
  config.headers.Authorization = '123'
  return config
})

// 响应拦截器
responseInterceptor(response => {
  console.log(response, 'response22')
  checkStatus(response)
})

export const setHeaders = options => {
  headers = options
}

export const request = async (uri, body = JSON.stringify({}), callback = null) => {
  const options = {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      ...headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  let response = {}
  // 发送请求
  await fetchPro(uri, {
    ...options,
    headers
  }).then(data => {
    response = data
  })
  return response.json()
}
