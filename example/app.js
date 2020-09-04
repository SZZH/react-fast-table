/*** examples/src/app.js ***/
import React from 'react'
import { render } from 'react-dom'
import FastTable from '../src'
import 'antd/dist/antd.css'

const App = () => (
  <FastTable
    getDataList='/api/getList'
    insertItem='/api/insertItem'
    removeItem='/api/removeItem'
    updateItem='/api/updateItem'
    headers={{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'cache-control': 'no-store'
    }}
  />
)
render(<App />, document.getElementById('root'))