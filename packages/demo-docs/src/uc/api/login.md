# UC 服务接口


## 1. 接口说明

| 属性名 | 属性值        |
| :----- | :------------ |
| 名称   | 登录          |
| 类型   | POST          |
| 地址   | `/auth/login` |


## 2. 功能描述

提供手机号和密码的登录方式。


## 3. 请求参数

### 3.1 输入参数

| 参数 | 类型   | 备注              |
| :--- | :----- | :---------------- |
| name | string |                   |
| pwd  | string | PBKDF2 HS256 2048 |

### 3.2 输出参数

| 字段         | 类型   | 备注      |
| :----------- | :----- | :-------- |
| email        | string |           |
| idcard       | string | 身份证    |
| uid          | number |           |
| userName     | string |           |
| sex          | number | 1男，2女  |
| accessToken  | string | JWT HS256 |
| refreshToken | string | JWT HS256 |


## 4. 模型

- [API 接口参数](../model/login.ts)
- [Database 表结构](../model/database.model.ts)

