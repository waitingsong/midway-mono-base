# UC 用户中心数据库


### 功能
- 用户中心，实现用户信息查询、登录认证


### tb_app

---
App 应用列表
- [DDL](ddl/tb_app.sql)

| 字段名     | 字段类型     | 默认值 | 属性  | 备注   |
| :--------- | :----------- | -----: | :---- | :----- |
| app_id     | serial       |        | PK    | 应用id |
| app_name   | varchar(50)  | UNIQUE | CHECK |        |
| app_url    | varchar(255) |        | blank |        |
| app_valid  | int2         |      1 |       |        |
| app_secret | varchar(255) |        | blank |        |
| allow_ips  | inet[]       |     [] |       |        |
| ctime      | timestamp(6) |  now() |       |        |
| mtime      | timestamp(6) |   NULL |       |        |


### tb_member

---
注册用户基础信息
- [DDL](ddl/tb_member.sql)
- FILLFACTOR

| 字段名     | 字段类型     | 默认值 | 属性          | 备注                                          |
| :--------- | :----------- | -----: | :------------ | :-------------------------------------------- |
| uid        | serial       |        | PK            |                                               |
| user_name  | varchar(15)  |        | UNIQUE, CHECK | 账户名，用于登录，长度大于0，小写索引，手机号 |
| user_valid | int2         |        |               | 账户有效性，0无效，1有效                      |
| sex        | int2         |      0 |               | 生物性别：0未知，1男，2女                     |
| passwd     | varchar(255) |  blank |               |                                               |
| salt       | varchar(50)  |  blank |               |                                               |
| idcard     | varchar(50)  |  blank |               | 身份证号                                      |
| email      | varchar(50)  |  blank |               | 注册电子邮箱                                  |
| regip      | inet         |   NULL |               | 注册ip                                        |
| lastip     | inet         |   NULL |               | 最近执行登录ip                                |
| json       | jsonb        |   NULL |               |                                               |
| ctime      | timestamp(6) |  now() | BRIN          | 注册时间                                      |
| mtime      | timestamp(6) |   NULL |               | 最近登录时间                                  |

