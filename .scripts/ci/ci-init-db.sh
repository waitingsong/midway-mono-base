#!/bin/bash
set -e

psql -V
# netstat -tunpl
dig postgres

echo -e "\n"


SQL_DIR="$cwd/node_modules/@mw-components/taskman/dist/database/"
cd "$SQL_DIR"
. ./init-db.sh

SQL_DIR="$cwd/packages/demo-service/src/database/"
cd "$SQL_DIR"
. ./init-db.sh

cd "$cwd"

