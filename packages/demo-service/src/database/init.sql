--
DROP TABLE IF EXISTS tb_user;
CREATE TABLE tb_user (
  uid serial NOT NULL,
  user_name varchar(30) NOT NULL,
  email varchar(50) NOT NULL DEFAULT '',
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  mtime TIMESTAMP(6),
  PRIMARY KEY (uid)
);

COMMENT ON TABLE tb_user IS 'uc用户注册表
';

COMMENT ON COLUMN tb_user.user_name IS '用户名. 小写唯一索引';

CREATE UNIQUE INDEX CONCURRENTLY tb_user_user_name_idx ON tb_user (LOWER(user_name));

CREATE INDEX CONCURRENTLY tb_user_ctime_idx ON tb_user USING BRIN (ctime);

ALTER TABLE tb_user ADD CONSTRAINT user_name_positive_length CHECK (
  LENGTH(user_name) > 0
);

-- INSERT
BEGIN;

INSERT INTO tb_user (user_name, email) VALUES ('mockedName', 'foo@bar.com');
INSERT INTO tb_user (user_name, email) VALUES ('mockedName2', 'foo2@bar.com');

COMMIT;

