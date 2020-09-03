## 介绍
- 如果你的项目中需要很多的表格页，但没有太多复杂的业务逻辑，那么你可以试一下 react-fast-table
- 传入四个接口就生成一个简单的表格页面，减少前端的压力或可以将这种类似的表格页，完全交由后端配置
- 接口目前默认你使用正向代理跨域，所以接口不需要带服务器地址和端口
  - getDataList，获取表格数据
  - insertItem，新增
  - removeItem，删除
  - updateItem，修改
- 如果接口需要判断身份，则需要自己配置 headers，配置的 headers 将作为请求头
## 下载
`yarn add react-fast-table`
## 使用
```javascript
import React from 'react'
import FastTable from 'react-fast-table'

const App = () => (
  <FastTable
    getDataList='/getList'
    insertItem='/insertItem'
    removeItem='/removeItem'
    updateItem='/updateItem'
    headers={{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'cache-control': 'no-store'
    }}
  />
)

export default App
```