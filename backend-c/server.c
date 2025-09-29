#include <microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "db.h"

#define PORT 8080

typedef struct {
	char *data;
	size_t size;
} PostData;

static int send_json(struct MHD_Connection *conn, const char *json, int status) {
	struct MHD_Response *res = MHD_create_response_from_buffer(strlen(json), (void*)json, MHD_RESPMEM_MUST_COPY);
	MHD_add_response_header(res, "Content-Type", "application/json");
	int ret = MMD_send_response(conn, status, res);
	MHD_destroy_response(res);
	return ret;
}

static int send_text(struct MHD_Connection *conn, const char *text, int status) {
	struct MHD_Response *res = MHD_create_response_from_buffer(strlen(text), (void*)text, MHD_RESPMEM_MUST_COPY);
	int ret = MHD_queue_response(conn, status, res);
	MHD_destroy_response(res);
	return ret;
}

static int iterate_post(void *coninfo_cls, enum MHD_ValueKind kind, const char *key, const char *filename, const char *content_type, const char *transfer_encoding, const char *data, uint64_t off, size_t size) {
	PostData *pd = (PostData*)coninfo_cls;
	if (size > 0) {
		pd->data = (char*)realloc(pd->data, pd->size + size + 1);
		memcpy(pd->data + pd->size, data, size);
		pd->size += size;
		pd->data[pd->size] = '\0';
	}
	return MHD_YES;
}

static int handler(void *cls, struct MHD_Connection *conn, const char *url, const char *method, const char *version, const char *upload_data, size_t *upload_data_size, void **ptr) {
	static int dummy;
	if (&dummy != *ptr) {
		*ptr = &dummy;
		return MHD_YES;
	}

	sqlite3 *db = (sqlite3*)cls;

	if (strcmp(method, "GET") == 0 && strcmp(url, "/events") == 0) {
		char *json = NULL;
		if (db_list_events(db, &json) != SQLITE_OK) return send_text(conn, "{\"error\":\"db error\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);
		int ret = send_json(conn, json, MHD_HTTP_OK);
		free(json);
		return ret;
	}

	if (strcmp(method, "POST") == 0 && strcmp(url, "/events") == 0) {
		// Expect a simple CSV body: id,title,date,time,duration,priority,createdAtMs
		static PostData pd = {0};
		if (*upload_data_size != 0) {
			iterate_post(&pd, MHD_POSTDATA_KIND, NULL, NULL, NULL, NULL, upload_data, 0, *upload_data_size);
			*upload_data_size = 0;
			return MHD_YES;
		}
		char *body = pd.data ? pd.data : strdup("");
		pd.data = NULL; pd.size = 0;
		char *tok;
		char *saveptr;
		char *fields[7] = {0};
		int i = 0;
		for (tok = strtok_r(body, ",", &saveptr); tok && i < 7; tok = strtok_r(NULL, ",", &saveptr)) fields[i++] = tok;
		if (i < 7) { free(body); return send_text(conn, "bad request", MHD_HTTP_BAD_REQUEST); }
		int rc = db_create_event(db, fields[0], fields[1], fields[2], fields[3], atoi(fields[4]), atoi(fields[5]), atol(fields[6]));
		free(body);
		if (rc != SQLITE_OK) return send_text(conn, "db error", MHD_HTTP_INTERNAL_SERVER_ERROR);
		return send_text(conn, "ok", MHD_HTTP_CREATED);
	}

	if (strcmp(method, "DELETE") == 0 && strncmp(url, "/events/", 8) == 0) {
		const char *id = url + 8;
		if (db_delete_event(db, id) != SQLITE_OK) return send_text(conn, "db error", MHD_HTTP_INTERNAL_SERVER_ERROR);
		return send_text(conn, "ok", MHD_HTTP_OK);
	}

	return send_text(conn, "not found", MHD_HTTP_NOT_FOUND);
}

int main() {
	sqlite3 *db = NULL;
	if (db_open(&db, "./events.db") != SQLITE_OK) {
		fprintf(stderr, "failed to open db\n");
		return 1;
	}
	if (db_init(db) != SQLITE_OK) {
		fprintf(stderr, "failed to init db\n");
		return 1;
	}

	struct MHD_Daemon *daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, PORT, NULL, NULL, &handler, db, MHD_OPTION_END);
	if (!daemon) {
		fprintf(stderr, "failed to start server\n");
		return 1;
	}
	printf("Server listening on port %d\n", PORT);
	getchar();
	MHD_stop_daemon(daemon);
	db_close(db);
	return 0;
}


