/*** examples/src/app.js ***/
import React from 'react'
import { render } from 'react-dom'
import FastTable from 'react-fast-table'
import 'antd/dist/antd.css'

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
render(<App />, document.getElementById('root'))