#!/bin/bash
set -e

echo -e "\n"
echo "\l" | psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d postgres


SQL_DIR='demo'
cd "$SQL_DIR"
. ./init.sh
cd -

SQL_DIR='default'
cd "$SQL_DIR"
. ./init.sh
cd -

SQL_DIR='taskman'
cd "$SQL_DIR"
. ./init.sh
cd -


psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "\d+"

