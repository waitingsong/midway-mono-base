-- ENUM 类型列表
--

SELECT
  t.typname,
  d.description,
  e.*
FROM
  pg_type t
  INNER JOIN pg_enum e ON e.enumtypid = t.oid
  INNER JOIN pg_description d ON d.objoid = t.oid
ORDER BY
  t.oid DESC,
  e.enumsortorder;

--

CREATE TYPE type_common_op AS ENUM (
  'create',
  'read',
  'upd',
  'del'
);

COMMENT ON TYPE type_common_op IS 'CRUD操作符';

--

CREATE TYPE type_op_state AS ENUM (
  'init',
  'idle',
  'pending',
  'running',
  'failed',
  'suspended',
  'succeeded',
  'cancelled',
  'completed'
);

COMMENT ON TYPE type_op_state IS '通用操作执行状态';

--

