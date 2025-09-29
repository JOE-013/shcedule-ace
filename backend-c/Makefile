CC=gcc
CFLAGS=-O2 -Wall -Wextra -std=c11 -fPIC
LIBS=-lsqlite3

SRV_SRC=server.c db.c
SRV_BIN=schedule_server

ALG_SRC=alg.c
ALG_SO=libalg.so

all: $(ALG_SO)

$(SRV_BIN): $(SRV_SRC)
	$(CC) $(CFLAGS) -o $@ $(SRV_SRC) -lmicrohttpd $(LIBS)

$(ALG_SO): $(ALG_SRC)
	$(CC) $(CFLAGS) -shared -o $@ $(ALG_SRC)

clean:
	rm -f $(SRV_BIN) $(ALG_SO)

.PHONY: all clean


