--
CREATE TABLE tb_task_payload (
  task_id int8 NOT NULL,
  json jsonb NOT NULL,
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  mtime TIMESTAMP(6),
  PRIMARY KEY (task_id)
);

COMMENT ON TABLE tb_task_payload IS 'TM任务执行所需数据';

CREATE INDEX CONCURRENTLY ON tb_task_payload USING BRIN (ctime);
CREATE INDEX CONCURRENTLY ON tb_task_payload USING BRIN (mtime);


--
