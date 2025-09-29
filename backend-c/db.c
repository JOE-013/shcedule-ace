#include "db.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int db_open(sqlite3 **db, const char *path) {
	return sqlite3_open(path, db);
}

int db_init(sqlite3 *db) {
	const char *sql =
		"CREATE TABLE IF NOT EXISTS events (" \
		"id TEXT PRIMARY KEY, title TEXT, date TEXT, time TEXT, duration INTEGER, priority INTEGER, createdAtMs INTEGER);";
	char *err = NULL;
	int rc = sqlite3_exec(db, sql, 0, 0, &err);
	if (rc != SQLITE_OK) {
		fprintf(stderr, "DB init error: %s\n", err);
		sqlite3_free(err);
	}
	return rc;
}

int db_close(sqlite3 *db) {
	return sqlite3_close(db);
}

int db_create_event(sqlite3 *db, const char *id, const char *title, const char *date, const char *time, int duration, int priority, long createdAtMs) {
	const char *sql = "INSERT INTO events(id,title,date,time,duration,priority,createdAtMs) VALUES(?,?,?,?,?,?,?);";
	sqlite3_stmt *stmt;
	if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) return SQLITE_ERROR;
	sqlite3_bind_text(stmt, 1, id, -1, SQLITE_TRANSIENT);
	sqlite3_bind_text(stmt, 2, title, -1, SQLITE_TRANSIENT);
	sqlite3_bind_text(stmt, 3, date, -1, SQLITE_TRANSIENT);
	sqlite3_bind_text(stmt, 4, time, -1, SQLITE_TRANSIENT);
	sqlite3_bind_int(stmt, 5, duration);
	sqlite3_bind_int(stmt, 6, priority);
	sqlite3_bind_int64(stmt, 7, createdAtMs);
	int rc = sqlite3_step(stmt);
	sqlite3_finalize(stmt);
	return rc == SQLITE_DONE ? SQLITE_OK : rc;
}

static int list_cb(void *ud, int argc, char **argv, char **col) {
	// Build a JSON array string in ud (char**)
	char **bufp = (char**)ud;
	// Append comma if not first
	if ((*bufp)[0] != '\0') strcat(*bufp, ",");
	char item[1024];
	snprintf(item, sizeof(item),
		"{\"id\":\"%s\",\"title\":\"%s\",\"date\":\"%s\",\"time\":\"%s\",\"duration\":%s,\"priority\":%s,\"createdAtMs\":%s}",
		argv[0], argv[1], argv[2], argv[3], argv[4], argv[5], argv[6]);
	strcat(*bufp, item);
	return 0;
}

int db_list_events(sqlite3 *db, char **json_out) {
	const char *sql = "SELECT id,title,date,time,duration,priority,createdAtMs FROM events ORDER BY createdAtMs ASC;";
	// allocate buffer
	char *buf = (char*)calloc(1, 64 * 1024);
	strcat(buf, "[");
	char *inner = (char*)calloc(1, 64 * 1024);
	int rc = sqlite3_exec(db, sql, list_cb, &inner, NULL);
	strcat(buf, inner);
	free(inner);
	strcat(buf, "]");
	*json_out = buf;
	return rc;
}

int db_delete_event(sqlite3 *db, const char *id) {
	const char *sql = "DELETE FROM events WHERE id=?;";
	sqlite3_stmt *stmt;
	if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) return SQLITE_ERROR;
	sqlite3_bind_text(stmt, 1, id, -1, SQLITE_TRANSIENT);
	int rc = sqlite3_step(stmt);
	sqlite3_finalize(stmt);
	return rc == SQLITE_DONE ? SQLITE_OK : rc;
}


