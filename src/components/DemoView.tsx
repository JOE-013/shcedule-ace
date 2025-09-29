import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, GitBranch, Star, Eye } from "lucide-react";

const steps = [
	{ 
		icon: Calendar, 
		title: "Create Events", 
		detail: "Add an event with date, time, duration and priority",
		gradient: "from-primary/20 to-primary-glow/20"
	},
	{ 
		icon: GitBranch, 
		title: "Check Overlaps", 
		detail: "The app highlights overlaps in the Conflict Graph",
		gradient: "from-secondary/20 to-accent/20"
	},
	{ 
		icon: Sparkles, 
		title: "Get Suggestions", 
		detail: "We suggest best allocations to avoid overlaps",
		gradient: "from-success/20 to-primary/20"
	},
	{ 
		icon: Star, 
		title: "Prioritize", 
		detail: "Earlier scheduled and High priority events win ties",
		gradient: "from-hero/20 to-primary-glow/20"
	},
	{ 
		icon: Eye, 
		title: "Review & Adjust", 
		detail: "See your events and adjust priorities anytime",
		gradient: "from-accent/20 to-secondary/20"
	},
];

const DemoView = () => {
	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<Card className="animate-scale-in border-none shadow-card bg-gradient-to-br from-background to-accent/5">
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
						How EventFlow Works
					</CardTitle>
					<p className="text-muted-foreground">
						Follow these simple steps to master your schedule
					</p>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{steps.map((step, i) => {
							const Icon = step.icon;
							return (
								<div 
									key={i} 
									className={`group relative p-6 rounded-xl bg-gradient-to-br ${step.gradient} border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant hover:scale-105`}
								>
									<div className="flex flex-col items-center text-center space-y-4">
										<div className="p-3 rounded-full bg-background/80 backdrop-blur-sm shadow-glow">
											<Icon className="w-6 h-6 text-primary" />
										</div>
										<div className="space-y-2">
											<h3 className="font-semibold text-lg">{step.title}</h3>
											<p className="text-sm text-muted-foreground leading-relaxed">
												{step.detail}
											</p>
										</div>
										<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-glow">
											{i + 1}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DemoView;


