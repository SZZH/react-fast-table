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
- 前端代码
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
- 接口数据格式
  - getDataList

    - 请求格式

      - ```javascript
        {
          input:{},
          current: 1,
          pageSize: 20,
          sorter: {
            file: 'age', // 字段名
            order: 'ascend' | 'descend' // 排序方式
          }
        }
        ```

    - 响应格式

      - list: 表格数据 

    ```json
    [
        {
            "id": {
                "value": 0,
                "isShow": false
            },
            "name": {
                "value": "test0",
                "isShow": true
            },
            "age": {
                "value": 20,
                "isShow": true
            },
            "sex": {
                "value": 1,
                "isShow": true
            },
            "date": {
                "value": "2020-01-01",
                "isShow": true
            },
            "date2": {
                "value": [
                    "2020-01-01",
                    "2020-01-02"
                ],
                "isShow": true
            }
        }
    ]
    ```
        - pagination: 分页，具体配置可参照 antd 的 pagination

    ```json
    "pagination": {
        "pageSize": 20,
        "total": 10,
        "showQuickJumper": true,
        "showSizeChanger": true
    }
    ```
    - header: table 表头和表单元素的配置，字段名要与 list 的字段名对应，设置为 false 时不显示
      - title： 显示在表头的文字
      - sorter: 是否排序(true | false)，
      - inputOptions：需要展示的表单，用于查询，新增，修改
        - type：表单元素类型
          - Input：普通输入框
          - InputNumber：数字输入框
          - Select：下拉框，type 为 Select 需要为其配置 enums，详情见下方
          - DatePicker：日期控件，数据格式：'2020-01-01'
          - RangePicker：时间范围控件，数据格式：['2020-01-01', '2020-01-02'],
        - required：是否为必填项，'true | false'
        - defaultValue：表单元素默认值
        - enums：当 type 为 Select 时，配置此为其枚举选项
        - placeholder：提示内容
        - isSearch： 是否需要作为搜索选项
    ```json
    "header": {
        "id": false,
        "name": {
            "title": "姓名",
            "inputOptions": {
                "type": "Input",
                "required": false,
                "defaultValue": "",
                "enums": [],
                "placeholder": "请输入姓名",
                "isSearch": true
            }
        },
        "age": {
            "title": "年龄",
            "inputOptions": {
                "type": "InputNumber",
                "required": true,
                "defaultValue": null,
                "placeholder": "请输入年龄",
                "isSearch": true
            }
        },
        "sex": {
            "title": "性别",
            "inputOptions": {
                "type": "Select",
                "required": true,
                "defaultValue": 1,
                "placeholder": "请输入性别",
                "isSearch": true,
                "enums": {
                    "0": "女",
                    "1": "男"
                }
            }
        },
        "date": {
            "title": "时间",
            "inputOptions": {
                "type": "DatePicker",
                "required": true,
                "defaultValue": "2001",
                "isSearch": true
            }
        },
        "date2": {
            "title": "两个时间",
            "inputOptions": {
                "type": "RangePicker",
                "required": true,
                "defaultValue": [
                    "2001",
                    "2002"
                ],
                "isSearch": true
            }
        }
    }
    ```
    getDataList 数据实例
```javascript
{
    "list": [
        {
            "id": {
                "value": 0,
                "isShow": false
            },
            "name": {
                "value": "test0",
                "isShow": true
            },
            "age": {
                "value": 20,
                "isShow": true
            },
            "sex": {
                "value": 1,
                "isShow": true
            },
            "date": {
                "value": "2020-01-01",
                "isShow": true
            },
            "date2": {
                "value": [
                    "2020-01-01",
                    "2020-01-02"
                ],
                "isShow": true
            }
        }
    ],
    "header": {
        "id": false,
        "name": {
            "title": "姓名",
            "inputOptions": {
                "type": "Input",
                "required": false,
                "defaultValue": "",
                "enums": [],
                "placeholder": "请输入姓名",
                "isSearch": true
            }
        },
        "age": {
            "title": "年龄",
            "inputOptions": {
                "type": "InputNumber",
                "required": true,
                "defaultValue": null,
                "placeholder": "请输入年龄",
                "isSearch": true
            }
        },
        "sex": {
            "title": "性别",
            "inputOptions": {
                "type": "Select",
                "required": true,
                "defaultValue": 1,
                "placeholder": "请输入性别",
                "isSearch": true,
                "enums": {
                    "0": "女",
                    "1": "男"
                }
            }
        },
        "date": {
            "title": "时间",
            "inputOptions": {
                "type": "DatePicker",
                "required": true,
                "defaultValue": "2001",
                "isSearch": true
            }
        },
        "date2": {
            "title": "两个时间",
            "inputOptions": {
                "type": "RangePicker",
                "required": true,
                "defaultValue": [
                    "2001",
                    "2002"
                ],
                "isSearch": true
            }
        }
    },
    "pagination": {
        "pageSize": 20,
        "total": 10,
        "showQuickJumper": true,
        "showSizeChanger": true
    }
}
```
  - insertItem
    - 请求参数
    ```json
    {
      "input": {
        "name": "1234",
        "age": 12,
        "sex": 1,
        "date": "2001-01-01 12:00:00",
        "date2": [
          "2001-01-01 12:00:00",
          "2002-01-01 12:00:00"
        ]
      }
    }
    ```
    - 返回参数
    ```json
    {"status": "success"}
    ```
  - updateItem，与 insertItem 基本一致
  - removeItem
    - 请求参数
    ```json
    {"input": 0}
    ```
    - 返回参数
    ```json
    {status: "success"}
    ```