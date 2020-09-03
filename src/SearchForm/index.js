import React from 'react'
import { Form, Col, Row, Button } from 'antd'
import { SearchOutlined, RollbackOutlined } from '@ant-design/icons'

import styles from '../index.module.css'

const SearchForm = ({ allInput, inputEnums, updateData }) => {
  const [form] = Form.useForm()
  const handleResetSearchForm = () => {
    form.resetFields()
    updateData({
      current: 1,
      pageSize: 20,
      input: {}
    })
  }

  // 提交按钮点击事件
  const handleSubmitOnClick = () => {
    form.submit()
  }

  // form 提交事件
  const handleOnFinish = input => {
    updateData({
      current: 1,
      pageSize: 20,
      input
    })
  }

  return (
    <div className={styles['form-container']}>
      <Form
        form={form}
        validateMessages={{
          required: '${label}是必填项'
        }}
        onFinish={handleOnFinish}
        labelAlign='right'
      >
        <Row gutter={24}>
          {
            allInput.map((input, index) => {
              if (!input.isSearch) return
              return (
                <Col span={6}>
                  <Form.Item
                    name={input.key}
                    label={input.title}
                    key={index}
                    style={{
                      width: '100%'
                    }}
                    labelCol={input.title.length > 5 && { span: 12 } || { span: 6 }}
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                  >
                    {inputEnums[input.type] && inputEnums[input.type]({...input})}
                  </Form.Item>
                </Col>
              )
            })
          }
          <Col>
            <Form.Item>
              <Button
                type='primary'
                onClick={handleSubmitOnClick}
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Button
              type='primary'
              onClick={handleResetSearchForm}
              icon={<RollbackOutlined />}
            >
              重置
            </Button>
          </Col>
        </Row>
        
      </Form>
    </div>
  )
}

export default SearchForm