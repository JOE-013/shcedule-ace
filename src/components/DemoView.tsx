import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const steps = [
	{ name: "1. Create", value: 1, detail: "Add an event with date, time, duration and priority" },
	{ name: "2. Check", value: 2, detail: "The app highlights overlaps in the Conflict Graph" },
	{ name: "3. Suggest", value: 3, detail: "We suggest best allocations to avoid overlaps" },
	{ name: "4. Prioritize", value: 4, detail: "Earlier scheduled and High priority events win ties" },
	{ name: "5. Review", value: 5, detail: "See your events and adjust priorities anytime" },
];

const DemoView = () => {
	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<Card className="animate-scale-in">
				<CardHeader>
            <CardTitle>How to Use EventFlow</CardTitle>
				</CardHeader>
				<CardContent className="grid md:grid-cols-2 gap-6">
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={steps}>
								<XAxis dataKey="name" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                        Follow these steps to create events, view overlaps, and get the best scheduling suggestions.
                    </div>
						<Separator />
						<ol className="space-y-2 list-decimal pl-5">
							{steps.map((s, i) => (
								<li key={i} className="leading-relaxed">
									<span className="font-medium mr-2">{s.name}</span>
									<span className="text-muted-foreground">{s.detail}</span>
								</li>
							))}
						</ol>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DemoView;


