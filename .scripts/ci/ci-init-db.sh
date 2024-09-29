#!/bin/bash
set -e

psql -V
# netstat -tunpl
dig postgres

psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "SELECT version();"
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "SHOW TIMEZONE;"

echo -e "\n"

psql -h $PGMQ_HOST -p $PGMQ_PORT -U$PGMQ_USER -d $PGMQ_DB -c "SELECT version();"
psql -h $PGMQ_HOST -p $PGMQ_PORT -U$PGMQ_USER -d $PGMQ_DB -c "SHOW TIMEZONE;"

SQL_DIR='./node_modules/@waiting/pgmq-js/database/'
cd "$SQL_DIR"
. ./init-db.sh
cd -

SQL_DIR="$cwd/packages/demo-service/database/"
cd "$SQL_DIR"
. ./init-db.sh

cd "$cwd"

