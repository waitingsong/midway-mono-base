--
CREATE TABLE tb_task_result (
  task_id int8 NOT NULL,
  json jsonb NOT NULL,
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id),
  FOREIGN KEY (task_id) REFERENCES tb_task ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE
);

COMMENT ON TABLE tb_task_result IS 'TM任务执行结果';

CREATE INDEX CONCURRENTLY ON tb_task_result USING BRIN (ctime);


--
