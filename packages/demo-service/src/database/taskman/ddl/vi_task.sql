--
CREATE VIEW vi_task AS
  SELECT task_id, task_state, expect_start, started_at,
    is_timeout, timeout_intv, ctime, mtime
    FROM tb_task
  UNION ALL
  SELECT task_id, task_state, expect_start, started_at,
    is_timeout, timeout_intv, ctime, mtime
    FROM tb_task_archive
;

COMMENT ON VIEW vi_task IS 'TM任务队列视图';

--
