#!/bin/bash
# Läuft beim ersten MySQL-Init (leeres Volume). Erteilt dem App-User
# CREATE/DROP-DATABASE-Rechte für die Tenant-DBs (stancl/tenancy).
set -e

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
GRANT CREATE, DROP, ALTER, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE, LOCK TABLES, EXECUTE, TRIGGER ON *.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
EOSQL
