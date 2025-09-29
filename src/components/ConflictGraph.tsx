import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { buildConflictGraph, computeAllocationPlan, explainAllocation, EventItem } from "@/lib/scheduling";

interface ConflictGraphProps {
	/** Lightweight event input for display integration */
	events: Array<{
		id: string | number;
		title: string;
		date: string; // YYYY-MM-DD
		time: string; // HH:MM (24h)
		durationMinutes?: number; // defaults to 60
		priority?: number;
		createdAtMs?: number;
	}>;
	preferFirstScheduled?: boolean;
}

const ConflictGraph = ({ events, preferFirstScheduled = true }: ConflictGraphProps) => {
	const normalized: EventItem[] = events.map((e, idx) => ({
		id: String(e.id),
		title: e.title,
		date: e.date,
		time: e.time,
		durationMinutes: e.durationMinutes ?? 60,
		priority: e.priority ?? 0,
		createdAtMs: e.createdAtMs ?? idx,
	}));

	const idToEvent = Object.fromEntries(normalized.map(e => [e.id, e]));
	const graph = buildConflictGraph(normalized);
	const plan = computeAllocationPlan({ events: normalized, preferFirstScheduled });
	const allocationSummary = explainAllocation(plan, idToEvent);

	const conflictCount = graph.edges.length;

	return (
		<Card className="animate-slide-up">
			<CardHeader>
            <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                        Conflict Graph
                    </span>
                    <Badge variant={conflictCount > 0 ? "destructive" : "secondary"}>
                        {conflictCount} {conflictCount === 1 ? "conflict" : "conflicts"}
                    </Badge>
                </CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-sm text-muted-foreground">
					Shows overlapping events as a graph and suggested allocations using Welsh–Powell.
				</div>
				<Separator />
                <div className="grid md:grid-cols-2 gap-6">
					<div className="space-y-2">
                        <div className="font-medium">Overlapping Pairs</div>
                        <div className="text-sm space-y-2">
							{graph.edges.length === 0 && <div className="text-muted-foreground">No overlaps detected</div>}
							{graph.edges.map((e, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-accent/40">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                                        <span>{idToEvent[e.from]?.title ?? e.from}</span>
                                    </div>
                                    <span className="text-muted-foreground">↔</span>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-secondary rounded-full" />
                                        <span>{idToEvent[e.to]?.title ?? e.to}</span>
                                    </div>
								</div>
							))}
						</div>
					</div>
					<div className="space-y-2">
                        <div className="font-medium">Suggested Allocation</div>
                        <div className="text-sm space-y-2">
							{allocationSummary.map((line, i) => (
                                <div key={i} className="p-2 rounded-md bg-accent/30">{line}</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ConflictGraph;


