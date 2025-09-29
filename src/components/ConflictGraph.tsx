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
		<Card className="animate-slide-up border-none shadow-card bg-gradient-to-br from-background via-background to-primary/5">
			<CardHeader className="space-y-4">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary-glow/20">
							<span className="inline-block w-3 h-3 rounded-full bg-primary animate-pulse" />
						</div>
						<span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
							Conflict Graph
						</span>
					</CardTitle>
					<Badge 
						variant={conflictCount > 0 ? "destructive" : "secondary"}
						className="shadow-glow"
					>
						{conflictCount} {conflictCount === 1 ? "conflict" : "conflicts"}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground">
					Overlapping events analyzed with Welsh–Powell graph coloring algorithm
				</p>
			</CardHeader>
			<CardContent className="space-y-6">
				<Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
				<div className="grid md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center gap-2 font-semibold text-lg">
							<div className="w-1 h-6 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
							Overlapping Pairs
						</div>
						<div className="space-y-3">
							{graph.edges.length === 0 && (
								<div className="p-6 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 text-center">
									<p className="text-success font-medium">✓ No overlaps detected</p>
									<p className="text-sm text-muted-foreground mt-1">Your schedule is conflict-free!</p>
								</div>
							)}
							{graph.edges.map((e, i) => (
								<div 
									key={i} 
									className="group relative p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border border-primary/10 hover:border-primary/30 hover:shadow-elegant transition-all duration-300"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-primary rounded-full shadow-glow" />
											<span className="font-medium">{idToEvent[e.from]?.title ?? e.from}</span>
										</div>
										<div className="text-muted-foreground font-bold">↔</div>
										<div className="flex items-center gap-3">
											<span className="font-medium">{idToEvent[e.to]?.title ?? e.to}</span>
											<div className="w-3 h-3 bg-secondary rounded-full shadow-glow" />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex items-center gap-2 font-semibold text-lg">
							<div className="w-1 h-6 bg-gradient-to-b from-success to-success/60 rounded-full" />
							Suggested Allocation
						</div>
						<div className="space-y-3">
							{allocationSummary.map((line, i) => (
								<div 
									key={i} 
									className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 hover:border-primary/20 hover:shadow-glow transition-all duration-300"
								>
									<p className="text-sm leading-relaxed">{line}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ConflictGraph;


