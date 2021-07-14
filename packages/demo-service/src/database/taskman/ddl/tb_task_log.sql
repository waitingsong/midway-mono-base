--
CREATE TABLE tb_task_log (
  task_log_id bigserial NOT NULL,
  task_id int8 NOT NULL,
  task_log_content TEXT,
  ctime TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (task_log_id),
  FOREIGN KEY (task_id) REFERENCES tb_task ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE
);

COMMENT ON TABLE tb_task_log IS 'TM任务执行信息，客户端和服务端产生数据';

CREATE INDEX CONCURRENTLY ON tb_task_log USING BRIN (ctime);

CREATE INDEX CONCURRENTLY tb_task_log_task_id_idx ON tb_task_log (task_id);


--
