# 数据库全局规则

定义数据库全局规则、约定，及命名缩写


### 规则

#### 01. 数据库名、表名，字段名必须使用小写英文字符且使用下划线 `_` 作为单词分隔符

#### 02. 除非显式声明，否则所有字段默认添加非空 (NOT NULL) 约束

#### 03. `timestamp` 及 `time` 类型默认为无时区的 `timestamp without time zone` 及 `time without time zone`

#### 04. `timestamp` `time` `interval` 类型精度 p 约定使用 `6`， 比如 `timestamp(6)`

#### 05. 避免设计 `boolean` 类型字段，应采用 `int2` 或者 `int4` 类型

#### 06. 外键字段需要重建索引

#### 07. `cancel` 撤销的过去分词必须采用 `cancelled` 拼写

#### 08. 除开日志表等特殊表，否则常用表应该添加 `ctime` 和 `mtime` 两个字段，分别表示创建时间和修改时间
- 默认值前者 `now()` 后者 `NULL`
- 精度皆为 6

#### 09. 表字段避免使用数据库及编程语言的关键字、保留字，比如
- `abstract`
- `asc`
- `desc`
- `var`

#### 10. 金额字段统一使用 `numeric(18, x)` 类型
- 两位小数为 `numeric(18, 2)`
- 四位小数为 `numeric(18, 4)`


### 约定

- 01. 建表 DDL 字段顺序保持与表设计文档一致
- 02. 数据库设计文档中字段默认值 `blank` 表示空字符串
- 03. 若设计字段默认值为 `NULL` 则表示该字段允许空 (NULL)
- 04. 表设计尽量保持本表字段靠前，引用外表字段在后


### 常用名词缩写

- `PK` 主键
- `FK` 外键
- `INDEX` 默认 `B-tree` 索引
- `BRIN` `HASH` `GIST` `GIN` 索引
- `UNIQUE` 唯一索引
- `PINDEX` 部分索引


### 文档

- [官方](https://www.postgresql.org/docs/)
- [中文](http://www.postgres.cn/docs/10)

