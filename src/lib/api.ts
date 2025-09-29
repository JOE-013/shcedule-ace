const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export interface ApiEventInput {
	id: string;
	title: string;
	date: string;
	time: string;
	duration: number;
	priority: number;
	createdAtMs: number;
}

export async function listEvents(): Promise<any[]> {
	const res = await fetch(`${BASE_URL}/events`);
	if (!res.ok) throw new Error(`Failed to list events: ${res.status}`);
	return await res.json();
}

// Note: backend expects CSV body for simplicity
export async function createEventCsv(e: ApiEventInput): Promise<void> {
	const body = [e.id, e.title, e.date, e.time, String(e.duration), String(e.priority), String(e.createdAtMs)].join(",");
	const res = await fetch(`${BASE_URL}/events`, { method: "POST", body });
	if (!res.ok) throw new Error(`Failed to create event: ${res.status}`);
}

export async function deleteEvent(id: string): Promise<void> {
	const res = await fetch(`${BASE_URL}/events/${encodeURIComponent(id)}`, { method: "DELETE" });
	if (!res.ok) throw new Error(`Failed to delete event: ${res.status}`);
}


