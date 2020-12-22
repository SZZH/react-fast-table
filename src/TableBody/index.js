/*
 * @Author: zenghao
 * @Date: 2020-07-23 22:55:58
 * @LastEditTime: 2020-11-02 15:01:19
 * @LastEditors: zenghao
 * @Description: 
 * @FilePath: /ReactFastTable/src/TableBody/index.js
 * @Copyright 2020 OBKoro1
 */

import React, { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, Tooltip } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Resizable } from 'react-resizable'

import styles from '../index.module.css'

const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

let columnsData = []

const TableBody = (props) => {
  const {
    dataSource = [],
    removeItem,
    tableHeader = [],
    pagination: paginationProps,
    updateData,
    handleShowEditModal
  } = props
  const [columns, setColumns] = useState([])
  const components = {
    header: {
      cell: ResizableTitle,
    },
  }

  // 分页状态
  const [pagination, setPagination] = useState({
    ...paginationProps,
    current: 1,
    onShowSizeChange: (current, pageSize) => {
      pagination.pageSize = pageSize
      setPagination(pagination)
    },
    onChange: (current, pageSize) => {
      pagination.current = current
      setPagination(pagination)
    },
    showTotal: (total) => <span>数据总数为：{total}条</span>
  })

  // 获取表头键列表
  const keys = Object.keys(tableHeader)
  let dataList = [...dataSource]
  const header = tableHeader

  // 组合行数据
  dataList = dataList.map(item => {
    let obj = {}
    for (let key of keys) {
      obj[key] = (item[key] && (item[key].enums && item[key].enums[item[key].value] || item[key].value))
    }
    obj.key = item.key
    obj.children = item.children
    return obj
  })

  // 操作列配置
  const options = {
    title: '操作',
    fixed: 'right',
    render: record => {
      return (
        <>
          <Button
            type="primary"
            className={styles['options-btn']}
            onClick={() => handleShowEditModal('edit', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title='是否删除这条数据？'
            onConfirm={() => removeItem({
              current: pagination.current,
              pageSize: pagination.pageSize,
              id: record.id
            })}
            cancelText='取消'
            okTest='确定'
            icon={<ExclamationCircleFilled />}
          >
            <Button
              type="primary"
              danger
              className={styles['options-btn']}
            >
              删除
            </Button>
          </Popconfirm>
        </>
      )
    },
    width: 50
  }

  const handleResize = i => (e, { size }) => {
    const index = i - 1
    const nextColumns = [...columnsData]
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    }
    setColumns(nextColumns)
    columnsData = nextColumns
  }

  // 生成 column 配置
  const getColumns = (header) => {
    if (!header) return

    let columns = keys.map((key, index) => {
      if (!header[key]) return false

      // 判断 header 配置中有没有 enums 项，若有从中取 value
      const hasEnums = header[key].inputOptions &&
        header[key].inputOptions.hasOwnProperty('enums') &&
        Object.keys(header[key].inputOptions.enums).length > 0

      return {
        title: () => {
          return (
            <Tooltip title={header[key].title}>
              <span>{header[key].title}</span>
            </Tooltip>
          )
        },
        sorter: header[key].sorter,
        dataIndex: key,
        ellipsis: {
          showTitle: false,
        },
        onHeaderCell: column => ({
          width: column.width,
          onResize: handleResize(index),
        }),
        width: header[key].title.length <= 4 && 50 || 80,
        align: 'center',
        render: data => {
          return (
            <Tooltip placement="topLeft" title={hasEnums && header[key].inputOptions.enums[data] || data}>
              {
                hasEnums &&
                  header[key].inputOptions.enums[data] ||
                  Array.isArray(data) && data.join('~') ||
                  data
              }
            </Tooltip>
          )
        }
      }
    })

    // 配置为 false 即不显示，再次过滤
    columns = columns.filter(item => item)

    // 在最后一列加入操作栏
    columns.push(options)
    return columns
  }

  useEffect(() => {
    setPagination({
      ...pagination,
      ...paginationProps,
    })
    setColumns(getColumns(header))
    columnsData = getColumns(header)
  }, [paginationProps])

  return (
    <Table
      {...props}
      bordered
      pagination={pagination}
      // columns={getColumns(header)}
      columns={columnsData}
      dataSource={dataList}
      scroll={{ x: 1500, y: 300 }}
      components={components}
      onChange={({current, pageSize}, filters, {field, order}) => {
        updateData({
          current,
          pageSize,
          sorter: {
            field,
            order
          }
        })
      }}
    />
  )
}

export default TableBody