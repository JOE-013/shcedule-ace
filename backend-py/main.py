from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import sqlite3
import ctypes
import os

DB_PATH = os.environ.get("DB_PATH", os.path.join(os.path.dirname(__file__), "events.db"))
ALG_PATH = os.environ.get("ALG_PATH", os.path.join(os.path.dirname(__file__), "../backend-c/libalg.so"))

lib = ctypes.CDLL(ALG_PATH)
colorize = lib.colorize
colorize.argtypes = [ctypes.c_int, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
colorize.restype = ctypes.c_int

app = FastAPI()

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT, date TEXT, time TEXT, duration INTEGER, priority INTEGER, createdAtMs INTEGER)")
    return conn

class EventIn(BaseModel):
    id: str
    title: str
    date: str
    time: str
    duration: int
    priority: int
    createdAtMs: int

class EventOut(EventIn):
    pass

@app.get("/events", response_model=List[EventOut])
def list_events():
    with db() as conn:
        cur = conn.execute("SELECT id,title,date,time,duration,priority,createdAtMs FROM events ORDER BY createdAtMs ASC")
        return [dict(r) for r in cur.fetchall()]

@app.post("/events")
def create_event(e: EventIn):
    with db() as conn:
        try:
            conn.execute("INSERT INTO events(id,title,date,time,duration,priority,createdAtMs) VALUES(?,?,?,?,?,?,?)", (e.id, e.title, e.date, e.time, e.duration, e.priority, e.createdAtMs))
            conn.commit()
            return {"ok": True}
        except sqlite3.IntegrityError:
            raise HTTPException(400, "id already exists")

@app.delete("/events/{id}")
def delete_event(id: str):
    with db() as conn:
        conn.execute("DELETE FROM events WHERE id=?", (id,))
        conn.commit()
        return {"ok": True}

@app.get("/allocate")
def allocate(date: str):
    # compute coloring for given date
    with db() as conn:
        cur = conn.execute("SELECT id,time,duration FROM events WHERE date=? ORDER BY time ASC", (date,))
        rows = cur.fetchall()
        n = len(rows)
        starts = (ctypes.c_int * n)()
        ends = (ctypes.c_int * n)()
        for i, r in enumerate(rows):
            h, m = map(int, r["time"].split(":"))
            start = h * 60 + m
            starts[i] = start
            ends[i] = start + int(r["duration"])
        colors = (ctypes.c_int * n)()
        used = colorize(n, starts, ends, colors)
        if used < 0:
            raise HTTPException(500, "coloring failed")
        result = []
        for i, r in enumerate(rows):
            result.append({"id": r["id"], "slot": int(colors[i])})
        return {"colorsUsed": used, "assignments": result}


