/*
 * @Author: zenghao
 * @Date: 2020-07-28 13:57:04
 * @LastEditTime: 2020-10-08 14:47:44
 * @LastEditors: zenghao
 * @Description: 
 * @FilePath: /ReactFastTable/src/index.js
 * @Copyright 2020 OBKoro1
 */

import React, { useState, useEffect } from 'react'
import { Button, Spin, Input, InputNumber, Select, DatePicker, ConfigProvider } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/es/locale/zh_CN'

import TableBody from './TableBody'
import EditModal from './EditModal'
import SearchForm from './SearchForm'
import { setHeaders } from './request'
import { getDataList, insertItem, removeItem, updateItem, setUri } from './service'
import { changeDataType } from './kits'

import './index.css'
const { RangePicker } = DatePicker

const formatMomentObj = obj => {
  const formatTemple = 'YYYY-MM-DD'
  let tempObj
  if(typeof obj !== 'object') return obj
  if(Array.isArray(obj)) {
    tempObj = [...obj]
    for(let i in tempObj) {
      if(typeof tempObj[i] === 'object' && !tempObj[i].hasOwnProperty('_isAMomentObject')) return obj
      tempObj[i] = tempObj[i].format(formatTemple)
    }
  }else {
    if(!obj.hasOwnProperty('_isAMomentObject')) return obj
    tempObj = obj.format(formatTemple)
  }

  return tempObj
}

const timeInputValue = {
  DatePicker: defaultValue => moment(defaultValue),
  RangePicker: defaultValue => [moment(defaultValue[0]), moment(defaultValue[1])]
}

// 获取编辑页面的 input 配置
const getAllInput = (header) => {
  let allInput = []

  for (let key in header) {
    // header 中无 key 或没有配置 inputOptions 时不添加 input
    if (!header[key] || !header[key].inputOptions) continue
    
    const type = header[key].inputOptions.type
    // 日期类型的 input ，需要经过 moment 格式化
    const defaultValue = timeInputValue.hasOwnProperty(type) &&
      timeInputValue[type](header[key].inputOptions.defaultValue) ||
      header[key].inputOptions.defaultValue

    allInput.push({
      ...header[key].inputOptions,
      key,
      title: header[key].title,
      type: header[key].inputOptions.type,
      defaultValue,
      required: header[key].inputOptions.required,
      enums: header[key].inputOptions.enums,
    })
  }
  return allInput
}

// 生成表单元素
const inputEnums = {
  'Input': options => <Input {...options}  style={{width: '100%'}}/>,
  'InputNumber': options => <InputNumber {...options}  style={{width: '100%'}}/>,
  'Select': options => (
    <Select {...options} style={{width: '100%'}}>
      {
        (() => {
          let resultArr = []
          for(let key in options.enums) {
            resultArr.push(
              <Select.Option
                value={changeDataType(options.defaultValue, key)}
              >
                {options.enums[key]}
              </Select.Option>
            )
          }
          return resultArr
        })()
      }
    </Select>
  ),
  'DatePicker': options => <DatePicker {...options}/>,
  'RangePicker': options => <RangePicker {...options}/>
}

// 页面配置初始化
const initPage = props => {
  setUri(props)
  setHeaders(props.headers)
}

let formData = {}

const FastTable = props => {
  initPage(props)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [editModalType, setEditModalType] = useState('add')
  const [data, setData] = useState({
    list: [],
    header: {},
    pagintion: {}
  })
  const [loading, setLoading] = useState(false)
  const [editSubmitLoading, setEditSubmitLoading] = useState(false)
  const [editData, setEditData] = useState({})

  // 保存 searchFormValue
  const setFormData = newFormData => {
    formData = newFormData
  }

  // 更新 data
  const updateData = async (body = { current: 1, pageSize: 20, input: {}, sorter: {} }) => {
    setFormData(body.input)
    console.log(body, '11')
    setLoading(true)
    const { list, pagination, header } = await getDataList({...body, input: formData})
    setData({
      list,
      header,
      pagination
    })
    setLoading(false)
  }

  // 编辑 modal 的取消事件
  const handleCancelEditModal = () => {
    setIsShowEditModal(false)
  }

  // 编辑的提交事件
  const handleEditSubmit = async formValues => {
    // 格式化数据，若为时间则格式化为 YYYY-MM-DD hh:mm:ss
    let tempFormValues = {...formValues}
    for(let key in tempFormValues) {
      tempFormValues[key] = formatMomentObj(tempFormValues[key])
    }
    
    setEditSubmitLoading(true)
    if (editModalType === 'add') {
      await insertItem({ input: tempFormValues })
    } else {
      await updateItem({
        input: { id: editData.id, ...tempFormValues }
      })
    }
    setEditSubmitLoading(false)
    updateData()
    handleCancelEditModal()
  }

  // 删除事件
  const handleRemoveItem = async ({ current, pageSize, id }) => {
    await removeItem({ input: id })
    updateData({ current, pageSize })
  }

  // 打开编辑 modal
  const handleShowEditModal = (type, record) => {
    setIsShowEditModal(true)
    setEditModalType(type)
    if (!record) return
    setEditData(record)
  }

  // 编辑 model 关闭的回调
  const handleModalOnClosed = () => {
    setEditData({})
  }

  useEffect(() => {
    updateData()
  }, [])

  console.log(data.list, 'list')

  return (
    <ConfigProvider locale={locale}>
      <Spin spinning={loading}>
        <div
          style={{
            overflow: 'auto',
            margin: '5px 0',
            padding: 10,
            width: '100%',
          }}
        >
          <Button
            type='primary'
            onClick={() => handleShowEditModal('add')}
          >
            新增
          </Button>
          <SearchForm
            allInput={getAllInput(data.header)}
            inputEnums={inputEnums}
            updateData={updateData}
            setFormData={setFormData}
          />
          <TableBody
            dataSource={data.list}
            pagination={data.pagination}
            tableHeader={data.header}
            removeItem={handleRemoveItem}
            updateData={updateData}
            handleShowEditModal={handleShowEditModal}
            style={{
              margin: '5px 0'
            }}
          />
          <EditModal
            title={editModalType === 'add' && '新增' || '编辑'}
            editModalType={editModalType}
            afterClose={handleModalOnClosed}
            allInput={getAllInput(data.header)}
            visible={isShowEditModal}
            handleEditSubmit={handleEditSubmit}
            onCancel={handleCancelEditModal}
            updateData={updateData}
            editSubmitLoading={editSubmitLoading}
            editData={editData}
            inputEnums={inputEnums}
          />
        </div>
      </Spin>
    </ConfigProvider>
  )
}

export default FastTable