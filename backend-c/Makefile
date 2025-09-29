CC=gcc
CFLAGS=-O2 -Wall -Wextra -std=c11 -fPIC

ALG_SRC=alg.c
ALG_SO=libalg.so

all: $(ALG_SO)

$(ALG_SO): $(ALG_SRC)
	$(CC) $(CFLAGS) -shared -o $@ $(ALG_SRC)

clean:
	rm -f $(ALG_SO)

.PHONY: all clean


