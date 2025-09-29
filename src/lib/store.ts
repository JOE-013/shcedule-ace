import { create } from "zustand";

export interface UiEvent {
	id: string;
	title: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:MM
	durationMinutes: number;
	location?: string;
	description?: string;
	category?: string;
	priority?: number; // lower means higher priority
	createdAtMs: number;
}

interface EventState {
	events: UiEvent[];
	addEvent: (e: Omit<UiEvent, "id" | "createdAtMs">) => UiEvent;
	setEvents: (e: UiEvent[]) => void;
	updateEventPriority: (id: string, priority: number) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
	events: [],
	addEvent: (e) => {
		const newEvent: UiEvent = {
			...e,
			id: crypto.randomUUID(),
			createdAtMs: Date.now(),
		};
		set({ events: [...get().events, newEvent] });
		return newEvent;
	},
	setEvents: (evts) => set({ events: evts }),
	updateEventPriority: (id, priority) => set({
    events: get().events.map(e => (e.id === id ? { ...e, priority } : e)),
  }),
}));


