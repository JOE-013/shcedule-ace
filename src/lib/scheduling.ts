// Scheduling algorithms and data structures: hash maps, adjacency list, Welsh–Powell coloring

export type EventId = string;

export interface EventItem {
	/** Stable unique id */
	id: EventId;
	/** ISO date string YYYY-MM-DD */
	date: string;
	/** 24h HH:MM */
	time: string;
	/** minutes */
	durationMinutes: number;
	/** human title */
	title: string;
	/** lower is higher priority; earlier created gets implicit priority boost */
	priority?: number;
	/** creation timestamp ms; used to prefer earlier scheduled duties */
	createdAtMs?: number;
}

export interface ConflictEdge {
	from: EventId;
	to: EventId;
}

export type AdjacencyList = Record<EventId, Set<EventId>>;

export interface ConflictGraphResult {
	adjacency: AdjacencyList;
	edges: ConflictEdge[];
}

export interface AllocationResult {
	/** color index per event (0..k-1) where same color means same slot/resource */
	coloring: Record<EventId, number>;
	/** number of colors used (independent sets) */
	chromaticNumber: number;
	/** events ordered by scheduling preference */
	priorityOrder: EventId[];
}

// Utility: parse HH:MM to minutes from midnight
function parseMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + (m || 0);
}

// Compute interval [start, end) in absolute minutes for an event
function eventInterval(event: EventItem): { start: number; end: number } {
	const start = parseMinutes(event.time);
	const end = start + event.durationMinutes;
	return { start, end };
}

// Overlap check in O(1)
function overlaps(a: EventItem, b: EventItem): boolean {
	if (a.date !== b.date) return false; // different days don't overlap
	const ia = eventInterval(a);
	const ib = eventInterval(b);
	return ia.start < ib.end && ib.start < ia.end;
}

// Build conflict graph using adjacency list. O(n^2) worst-case; optimized by bucketing per date.
export function buildConflictGraph(events: EventItem[]): ConflictGraphResult {
	// Hash map by date for bucketing: O(n)
	const dateToEvents: Record<string, EventItem[]> = {};
	for (const e of events) {
		(dateToEvents[e.date] ||= []).push(e);
	}

	const adjacency: AdjacencyList = {};
	const edges: ConflictEdge[] = [];

	for (const e of events) adjacency[e.id] = new Set<EventId>();

	// For each date bucket, compare intervals after sorting by start time to reduce comparisons
	for (const date of Object.keys(dateToEvents)) {
		const bucket = dateToEvents[date].slice().sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time));
		// Sweep-line style: maintain active set by end time
		const active: EventItem[] = [];
		for (const current of bucket) {
			// Remove non-overlapping from active
			for (let i = active.length - 1; i >= 0; i--) {
				if (eventInterval(active[i]).end <= eventInterval(current).start) {
					active.splice(i, 1);
				}
			}
			// Current overlaps with all active
			for (const a of active) {
				adjacency[current.id].add(a.id);
				adjacency[a.id].add(current.id);
				edges.push({ from: current.id, to: a.id });
			}
			active.push(current);
		}
	}

	return { adjacency, edges };
}

// Welsh–Powell graph coloring: O(E) after O(V log V) sort by degree
export function welshPowellColoring(adjacency: AdjacencyList): AllocationResult {
	const vertices = Object.keys(adjacency);
	const degree: Record<EventId, number> = {};
	for (const v of vertices) degree[v] = adjacency[v].size;

	// Sort vertices by descending degree for efficient coloring
	const order = vertices.slice().sort((a, b) => degree[b] - degree[a]);

	const coloring: Record<EventId, number> = {};
	let color = 0;

	for (const v of order) {
		if (coloring[v] !== undefined) continue;
		// assign current color to v
		coloring[v] = color;
		// assign same color to all vertices not adjacent to colored ones
		for (const u of order) {
			if (coloring[u] !== undefined) continue;
			let ok = true;
			for (const w of Object.keys(coloring)) {
				if (coloring[w] === color && (adjacency[u].has(w) || adjacency[w].has(u))) {
					ok = false;
					break;
				}
			}
			if (ok) coloring[u] = color;
		}
		color++;
	}

	return { coloring, chromaticNumber: Math.max(-1, ...Object.values(coloring)) + 1, priorityOrder: order };
}

export interface AllocationOptionsInput {
	events: EventItem[];
	/** Prefer earlier created events; if false, use numeric priority only */
	preferFirstScheduled?: boolean;
}

export interface AllocationSuggestion {
	/** Event id */
	id: EventId;
	/** slot index assigned by coloring */
	slot: number;
	/** reasons that affected decision */
	reasons: string[];
}

export interface AllocationPlan {
	graph: ConflictGraphResult;
	allocation: AllocationResult;
	suggestions: AllocationSuggestion[];
}

// Produce best-allocation options respecting priorities and creation order (first scheduled wins on conflicts)
export function computeAllocationPlan(input: AllocationOptionsInput): AllocationPlan {
	const { events, preferFirstScheduled = true } = input;
	// Normalize defaults
	for (const e of events) {
		if (e.priority === undefined) e.priority = 0;
		if (e.createdAtMs === undefined) e.createdAtMs = 0;
	}

	// Build conflict graph
	const graph = buildConflictGraph(events);

	// Sort by preference: lower priority value first, then earlier creation
	const preferred = events
		.slice()
		.sort((a, b) => {
			if (a.priority! !== b.priority!) return a.priority! - b.priority!;
			if (preferFirstScheduled) return a.createdAtMs! - b.createdAtMs!;
			return 0;
		})
		.map(e => e.id);

	// Reorder adjacency for Welsh–Powell tie-breaking: boost degrees but keep preferred earlier
	const adjacency = graph.adjacency;
	const vertices = Object.keys(adjacency);
	const degree: Record<EventId, number> = {};
	for (const v of vertices) degree[v] = adjacency[v].size;
	const order = vertices.slice().sort((a, b) => {
		if (degree[b] !== degree[a]) return degree[b] - degree[a];
		// On equal degree, prefer user priority order
		return preferred.indexOf(a) - preferred.indexOf(b);
	});

	// Color using Welsh–Powell on the custom order
	const coloring: Record<EventId, number> = {};
	let color = 0;
	for (const v of order) {
		if (coloring[v] !== undefined) continue;
		coloring[v] = color;
		for (const u of order) {
			if (coloring[u] !== undefined) continue;
			let ok = true;
			for (const w of Object.keys(coloring)) {
				if (coloring[w] === color && (adjacency[u].has(w) || adjacency[w].has(u))) {
					ok = false;
					break;
				}
			}
			if (ok) coloring[u] = color;
		}
		color++;
	}

	const allocation: AllocationResult = {
		coloring,
		chromaticNumber: Math.max(-1, ...Object.values(coloring)) + 1,
		priorityOrder: preferred,
	};

	// Build suggestions list with rationale
	const reasonsCache: Record<EventId, string[]> = {};
	for (const id of Object.keys(coloring)) reasonsCache[id] = [];

	for (const id of preferred) {
		reasonsCache[id].push("Higher priority per user setting");
	}
	if (preferFirstScheduled) {
		// Earlier created favored on conflicts
		const sameDayBuckets: Record<string, EventItem[]> = {};
		for (const e of events) (sameDayBuckets[e.date] ||= []).push(e);
		for (const day of Object.keys(sameDayBuckets)) {
			const dayEvents = sameDayBuckets[day].slice().sort((a, b) => (a.createdAtMs! - b.createdAtMs!));
			for (let i = 0; i < dayEvents.length; i++) {
				const e = dayEvents[i];
				reasonsCache[e.id].push(i === 0 ? "First scheduled on this date" : "Scheduled later on this date");
			}
		}
	}

	const suggestions: AllocationSuggestion[] = Object.entries(coloring).map(([id, slot]) => ({
		id,
		slot,
		reasons: reasonsCache[id],
	}));

	return { graph, allocation, suggestions };
}

// Convenience: generate display-friendly allocation summary
export function explainAllocation(plan: AllocationPlan, idToEvent: Record<EventId, EventItem>): string[] {
	return plan.suggestions
		.slice()
		.sort((a, b) => a.slot - b.slot)
		.map(s => {
			const e = idToEvent[s.id];
			return `Slot ${s.slot + 1}: ${e?.title || s.id} — ${s.reasons.join("; ")}`;
		});
}


