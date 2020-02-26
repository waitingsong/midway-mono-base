# UC 服务接口


## 1. 接口说明

| 属性名 | 属性值   |
| :----- | :------- |
| 名称   | 查询用户 |
| 类型   | GET      |
| 地址   | `/user`  |


## 2. 功能描述

用户基本信息


## 3. 请求参数

### 3.1 输入参数

| 参数 | 类型   | 备注 |
| :--- | :----- | :--- |
| uid  | number |      |

### 3.2 输出参数

| 字段     | 类型   | 备注 |
| :------- | :----- | :--- |
| email    | string |      |
| uid      | number |      |
| userName | string |      |


## 4. 模型

- [API 接口参数](../model/user.ts)
- [Database 表结构](../model/database.model.ts)

