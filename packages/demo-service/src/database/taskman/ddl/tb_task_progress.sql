--
CREATE UNLOGGED TABLE tb_task_progress (
  task_id int8 NOT NULL,
  task_progress int4 NOT NULL,
  ctime TIMESTAMP(6) NOT NULL DEFAULT now(),
  mtime TIMESTAMP(6),
  PRIMARY KEY (task_id),
  FOREIGN KEY (task_id) REFERENCES tb_task ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE
)
WITH (fillfactor=10);

COMMENT ON TABLE tb_task_progress IS 'TM任务进度. 可定期清理';

-- CREATE INDEX CONCURRENTLY ON tb_task_progress USING BRIN (ctime);
-- CREATE INDEX CONCURRENTLY ON tb_task_progress USING BRIN (mtime);

CREATE INDEX CONCURRENTLY tb_task_progress_task_id_idx ON tb_task_progress (task_id);
CREATE INDEX CONCURRENTLY tb_task_progress_task_progress_idx ON tb_task_progress (task_progress);

ALTER TABLE tb_task_progress ADD CONSTRAINT tb_task_progress_progress_value_range_0_to_100 CHECK (
  task_progress >= 0 AND task_progress <= 100
);


--
