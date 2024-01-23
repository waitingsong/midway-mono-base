--
CREATE TABLE tb_app (
  app_id serial NOT NULL,
  app_name varchar(50) NOT NULL,
  app_url varchar(255) NOT NULL DEFAULT '',
  app_valid int2 NOT NULL DEFAULT 1,
  app_secret varchar(1024) NOT NULL DEFAULT '',
  allow_ips inet[] NOT NULL DEFAULT '{}',
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  mtime TIMESTAMP(6),
  PRIMARY KEY (app_id),
  CONSTRAINT app_name_positive_length CHECK (LENGTH(app_name) > 0)
);

COMMENT ON TABLE tb_app IS '应用列表
https://git/@scope/project/blob/master/packages/demo-docs/src/uc/db/index.md#tb_app
';

CREATE UNIQUE INDEX ON tb_app (LOWER(app_name));

-- INSERT INTO tb_app (app_name, app_url) VALUES ('appfoo', 'https://')
-- DROP TABLE IF EXISTS tb_app CASCADE;

