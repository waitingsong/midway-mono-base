#!/bin/bash
set -e

psql -V
# netstat -tunpl
dig postgres

psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "SHOW TIMEZONE;"

echo -e "\n"


# SQL_DIR="$cwd/node_modules/@mwcp/taskman/database/"
# cd "$SQL_DIR"
# . ./init-db.sh

SQL_DIR="$cwd/packages/demo-service/database/"
cd "$SQL_DIR"
. ./init-db.sh

cd "$cwd"

