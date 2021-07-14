--
CREATE TABLE tb_task (
  task_id int8 NOT NULL DEFAULT nextval('tb_task_task_id_seq'),
  task_state type_op_state NOT NULL DEFAULT 'init',
  expect_start TIMESTAMP(3) NOT NULL DEFAULT now(),
  started_at TIMESTAMP(6),
  is_timeout boolean NOT NULL DEFAULT false,
  timeout_intv interval NOT NULL DEFAULT '2h',
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  mtime TIMESTAMP(6),
  PRIMARY KEY (task_id)
)
WITH (fillfactor=70);

COMMENT ON TABLE tb_task IS 'TM任务队列';

CREATE INDEX CONCURRENTLY ON tb_task USING BRIN (ctime);
CREATE INDEX CONCURRENTLY ON tb_task USING BRIN (mtime);

CREATE INDEX CONCURRENTLY tb_task_task_state_idx ON tb_task (task_state);
CREATE INDEX CONCURRENTLY tb_task_expect_start_task_state_idx
  ON tb_task USING BRIN (expect_start)
  WHERE task_state = 'init';


--
