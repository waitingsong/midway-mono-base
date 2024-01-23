--
CREATE TABLE tb_member (
  uid serial NOT NULL,
  user_name varchar(15) NOT NULL,
  user_valid int2 NOT NULL,
  passwd varchar(255) NOT NULL DEFAULT '',
  salt varchar(50) NOT NULL DEFAULT '',
  sex int2 NOT NULL DEFAULT 0,
  idcard varchar(50) NOT NULL DEFAULT '',
  email varchar(50) NOT NULL DEFAULT '',
  regip inet,
  lastip inet,
  json jsonb,
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  mtime TIMESTAMP(6),
  PRIMARY KEY (uid),
  CONSTRAINT user_name_positive_length CHECK (LENGTH(user_name) > 0)
);

COMMENT ON TABLE tb_member IS 'uc用户注册表
https://git/@scope/project/blob/master/packages/demo-docs/src/uc/db/index.md#tb_member
';

COMMENT ON COLUMN tb_member.user_name IS '小写唯一索引';

CREATE UNIQUE INDEX ON tb_member (LOWER(user_name));

CREATE INDEX ON tb_member USING BRIN (ctime);

