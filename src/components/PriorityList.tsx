import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEventStore } from "@/lib/store";

const PriorityList = () => {
	const events = useEventStore(s => s.events);
	const update = useEventStore(s => s.updateEventPriority);

	const ordered = events.slice().sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || a.createdAtMs - b.createdAtMs);

	return (
		<Card className="animate-scale-in">
			<CardHeader>
				<CardTitle>Priority List</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				{ordered.length === 0 && <div className="text-sm text-muted-foreground">No personal events yet</div>}
				{ordered.map((e) => (
					<div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
						<div>
							<div className="font-medium">{e.title}</div>
							<div className="text-sm text-muted-foreground">{e.date} {e.time}</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge variant="outline">Priority {e.priority ?? 0}</Badge>
							<div className="flex gap-1">
								<Button size="sm" variant="outline" onClick={() => update(e.id, Math.max(0, (e.priority ?? 0) - 1))}>-</Button>
								<Button size="sm" variant="outline" onClick={() => update(e.id, (e.priority ?? 0) + 1)}>+</Button>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
};

export default PriorityList;


