#!/bin/bash

# Database Migration Script for EEMB Website
# Handles database initialization and migrations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.development}"

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    echo -e "${GREEN}✓ Loaded environment from $ENV_FILE${NC}"
else
    echo -e "${RED}✗ Environment file not found: $ENV_FILE${NC}"
    exit 1
fi

# Database connection parameters
DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-eemb_dev}"
DB_USER="${DATABASE_USERNAME:-postgres}"
DB_PASSWORD="${DATABASE_PASSWORD:-postgres}"

# PostgreSQL connection string
export PGPASSWORD="$DB_PASSWORD"
PSQL_CMD="psql -h $DB_HOST -p $DB_PORT -U $DB_USER"

# Function to check if database exists
check_database() {
    echo -e "${YELLOW}Checking if database '$DB_NAME' exists...${NC}"
    if $PSQL_CMD -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo -e "${GREEN}✓ Database '$DB_NAME' exists${NC}"
        return 0
    else
        echo -e "${YELLOW}✗ Database '$DB_NAME' does not exist${NC}"
        return 1
    fi
}

# Function to create database
create_database() {
    echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
    $PSQL_CMD -c "CREATE DATABASE $DB_NAME;" postgres
    echo -e "${GREEN}✓ Database '$DB_NAME' created${NC}"
}

# Function to run initialization script
init_database() {
    echo -e "${YELLOW}Initializing database schema...${NC}"
    $PSQL_CMD -d "$DB_NAME" -f "$SCRIPT_DIR/init-database.sql"
    echo -e "${GREEN}✓ Database schema initialized${NC}"
}

# Function to create migrations table
create_migrations_table() {
    echo -e "${YELLOW}Creating migrations table...${NC}"
    $PSQL_CMD -d "$DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);
EOF
    echo -e "${GREEN}✓ Migrations table ready${NC}"
}

# Function to run a single migration
run_migration() {
    local migration_file=$1
    local filename=$(basename "$migration_file")
    local checksum=$(sha256sum "$migration_file" | cut -d' ' -f1)

    # Check if migration has already been run
    local exists=$($PSQL_CMD -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM migrations WHERE filename = '$filename';")

    if [ "$exists" -gt 0 ]; then
        echo -e "${YELLOW}⊘ Skipping '$filename' (already executed)${NC}"
        return 0
    fi

    echo -e "${YELLOW}→ Running migration: $filename${NC}"

    # Run the migration
    if $PSQL_CMD -d "$DB_NAME" -f "$migration_file"; then
        # Record successful migration
        $PSQL_CMD -d "$DB_NAME" <<EOF
INSERT INTO migrations (filename, checksum, success)
VALUES ('$filename', '$checksum', TRUE);
EOF
        echo -e "${GREEN}✓ Migration '$filename' completed${NC}"
        return 0
    else
        # Record failed migration
        $PSQL_CMD -d "$DB_NAME" <<EOF
INSERT INTO migrations (filename, checksum, success, error_message)
VALUES ('$filename', '$checksum', FALSE, 'Migration failed - check logs');
EOF
        echo -e "${RED}✗ Migration '$filename' failed${NC}"
        return 1
    fi
}

# Function to run all pending migrations
run_migrations() {
    local migrations_dir="$SCRIPT_DIR/migrations"

    if [ ! -d "$migrations_dir" ]; then
        echo -e "${YELLOW}No migrations directory found${NC}"
        return 0
    fi

    echo -e "${YELLOW}Running migrations...${NC}"

    # Get all SQL files in migrations directory, sorted by name
    for migration in $(ls "$migrations_dir"/*.sql 2>/dev/null | sort); do
        run_migration "$migration"
    done

    echo -e "${GREEN}✓ All migrations completed${NC}"
}

# Function to show migration status
show_status() {
    echo -e "${YELLOW}Migration Status:${NC}"
    $PSQL_CMD -d "$DB_NAME" <<EOF
SELECT
    filename,
    executed_at,
    CASE
        WHEN success THEN '✓ Success'
        ELSE '✗ Failed'
    END as status
FROM migrations
ORDER BY executed_at DESC
LIMIT 20;
EOF
}

# Function to rollback last migration
rollback() {
    echo -e "${YELLOW}Rolling back last migration...${NC}"

    # Get the last successful migration
    local last_migration=$($PSQL_CMD -d "$DB_NAME" -t -c "
        SELECT filename FROM migrations
        WHERE success = TRUE
        ORDER BY executed_at DESC
        LIMIT 1;
    " | xargs)

    if [ -z "$last_migration" ]; then
        echo -e "${YELLOW}No migrations to rollback${NC}"
        return 0
    fi

    # Look for rollback file
    local rollback_file="$SCRIPT_DIR/rollbacks/${last_migration%.sql}.rollback.sql"

    if [ -f "$rollback_file" ]; then
        echo -e "${YELLOW}→ Rolling back: $last_migration${NC}"
        if $PSQL_CMD -d "$DB_NAME" -f "$rollback_file"; then
            # Remove migration record
            $PSQL_CMD -d "$DB_NAME" -c "DELETE FROM migrations WHERE filename = '$last_migration';"
            echo -e "${GREEN}✓ Rollback completed${NC}"
        else
            echo -e "${RED}✗ Rollback failed${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ No rollback file found for $last_migration${NC}"
        return 1
    fi
}

# Function to backup database
backup() {
    local backup_dir="$ROOT_DIR/backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/eemb_${DB_NAME}_${timestamp}.sql"

    mkdir -p "$backup_dir"

    echo -e "${YELLOW}Creating backup...${NC}"
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" > "$backup_file"; then
        echo -e "${GREEN}✓ Backup saved to: $backup_file${NC}"

        # Compress the backup
        gzip "$backup_file"
        echo -e "${GREEN}✓ Backup compressed: ${backup_file}.gz${NC}"
    else
        echo -e "${RED}✗ Backup failed${NC}"
        return 1
    fi
}

# Function to restore from backup
restore() {
    local backup_file=$1

    if [ -z "$backup_file" ]; then
        echo -e "${RED}Please specify a backup file${NC}"
        echo "Usage: $0 restore <backup_file>"
        return 1
    fi

    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Backup file not found: $backup_file${NC}"
        return 1
    fi

    echo -e "${YELLOW}⚠️  WARNING: This will replace all data in database '$DB_NAME'${NC}"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        echo "Restore cancelled"
        return 0
    fi

    echo -e "${YELLOW}Restoring from backup...${NC}"

    # Handle compressed files
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | $PSQL_CMD -d "$DB_NAME"
    else
        $PSQL_CMD -d "$DB_NAME" < "$backup_file"
    fi

    echo -e "${GREEN}✓ Database restored from: $backup_file${NC}"
}

# Main command handler
case "${1:-}" in
    init)
        if ! check_database; then
            create_database
        fi
        init_database
        create_migrations_table
        ;;

    migrate)
        if ! check_database; then
            echo -e "${RED}Database does not exist. Run '$0 init' first${NC}"
            exit 1
        fi
        create_migrations_table
        run_migrations
        ;;

    status)
        if ! check_database; then
            echo -e "${RED}Database does not exist${NC}"
            exit 1
        fi
        show_status
        ;;

    rollback)
        if ! check_database; then
            echo -e "${RED}Database does not exist${NC}"
            exit 1
        fi
        rollback
        ;;

    backup)
        if ! check_database; then
            echo -e "${RED}Database does not exist${NC}"
            exit 1
        fi
        backup
        ;;

    restore)
        if ! check_database; then
            create_database
        fi
        restore "$2"
        ;;

    reset)
        echo -e "${YELLOW}⚠️  WARNING: This will delete and recreate database '$DB_NAME'${NC}"
        read -p "Are you sure? (yes/no): " confirm

        if [ "$confirm" == "yes" ]; then
            $PSQL_CMD -c "DROP DATABASE IF EXISTS $DB_NAME;" postgres
            create_database
            init_database
            create_migrations_table
            run_migrations
        else
            echo "Reset cancelled"
        fi
        ;;

    *)
        echo "EEMB Database Migration Tool"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  init      - Create database and initialize schema"
        echo "  migrate   - Run pending migrations"
        echo "  status    - Show migration status"
        echo "  rollback  - Rollback last migration"
        echo "  backup    - Create database backup"
        echo "  restore   - Restore from backup file"
        echo "  reset     - Drop and recreate database (WARNING: Data loss!)"
        echo ""
        echo "Environment:"
        echo "  DB: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
        echo ""
        exit 1
        ;;
esac

# Clean up
unset PGPASSWORD