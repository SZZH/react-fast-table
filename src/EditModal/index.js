/*
 * @Author: zenghao
 * @Date: 2020-07-26 16:04:20
 * @LastEditTime: 2020-08-31 16:00:50
 * @LastEditors: zenghao
 * @Description: 
 * @FilePath: /easy-table/src/components/EditModal/index.js
 * @Copyright 2020 OBKoro1
 */
import React, { useEffect } from 'react'
import { Modal, Form, Button, Tooltip, Typography } from 'antd'

const EditModal = (props) => {
  const { allInput, editData, handleEditSubmit, editModalType } = props
  const [form] = Form.useForm()

  // Modal 确定点击事件
  const handleOnOk = () => {
    form.submit()
  }

  // 表单提交事件
  const handleFormOnFinish = (values) => {
    handleEditSubmit(values)
  }

  const initValueFunc = () => {
    const initValuesTemp = {}
    if(editModalType === 'add') {
      allInput.forEach(item => {
        initValuesTemp[item.key] = item.defaultValue
      })
    }else {
      for(let key in editData) {
        initValuesTemp[key] = editData[key]
      }
    }
    form.setFieldsValue(initValuesTemp)
  }

  const handleModelClosed = () => {
    props.afterClose()
  }

  useEffect(() => {
    if(!props.visible) return
    initValueFunc()
  }, [props.visible])

  return (
    <Modal
      {...props}
      destroyOnClose={true}
      maskClosable={false}
      afterClose={handleModelClosed}
      footer={
        <>
          <Button onClick={props.onCancel}>取消</Button>
          <Button
            type="primary"
            onClick={handleOnOk}
            loading={props.editSubmitLoading}
          >
            确定
          </Button>
        </>
      }
    >
      <Form
        form={form}
        onFinish={handleFormOnFinish}
        validateMessages={{
          required: '${label}是必填项'
        }}
      >
        {
          allInput.map((input, index) => (
              <Form.Item
                name={input.key}
                label={(
                  <Tooltip title={input.title}>
                    {input.title}
                  </Tooltip>
                )}
                labelCol={{span: 5}}
                key={index}
                style={{
                  width: '100%'
                }}
                rules={[
                  {
                    required: input.required,
                  },
                ]}
              >
                {props.inputEnums[input.type](input)}
              </Form.Item>
            )
          )
        }
      </Form>
    </Modal>
  )
}

export default EditModal