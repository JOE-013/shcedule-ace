#ifndef DB_H
#define DB_H

#include <sqlite3.h>

int db_open(sqlite3 **db, const char *path);
int db_init(sqlite3 *db);
int db_close(sqlite3 *db);

// CRUD
int db_create_event(sqlite3 *db, const char *id, const char *title, const char *date, const char *time, int duration, int priority, long createdAtMs);
int db_list_events(sqlite3 *db, char **json_out);
int db_delete_event(sqlite3 *db, const char *id);

#endif // DB_H


