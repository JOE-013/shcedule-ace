import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useEventStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { buildConflictGraph } from "@/lib/scheduling";

interface EventFormProps {
  onCreated?: () => void;
}

const EventForm = ({ onCreated }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    description: "",
    priority: "high"
  });

  const addEvent = useEventStore(s => s.addEvent);
  const events = useEventStore(s => s.events);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMinutes = Math.max(1, parseInt(formData.duration || "60", 10));

    const isoDate = formData.date; // already YYYY-MM-DD
    const created = addEvent({
      title: formData.title,
      date: isoDate,
      time: formData.time,
      durationMinutes,
      location: formData.location,
      description: formData.description,
      priority: formData.priority === 'high' ? 0 : 1,
    });
    // Conflict notification: check overlaps on that date
    try {
      const sameDay = [...events, created]
        .filter(e => e.date === isoDate)
        .map((e, idx) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          durationMinutes: e.durationMinutes,
          priority: e.priority ?? 0,
          createdAtMs: e.createdAtMs ?? idx,
        }));
      const graph = buildConflictGraph(sameDay as any);
      if (graph.adjacency[created.id] && graph.adjacency[created.id].size > 0) {
        toast({ title: "Conflict detected", description: "This event overlaps with another on the selected day." });
      }
    } catch {}

    setFormData({ title: "", date: "", time: "", duration: "", location: "", description: "", priority: "high" });
    toast({ title: "Event scheduled", description: `${formData.title} on ${isoDate} at ${formData.time}` });
    if (onCreated) onCreated();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto animate-scale-in mx-4 md:mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Create New Event
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
                className="text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
                className="text-base"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                placeholder="e.g. 60"
                inputMode="numeric"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="priority" checked={formData.priority === 'high'} onChange={() => handleInputChange('priority','high')} />
                  High
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="priority" checked={formData.priority === 'low'} onChange={() => handleInputChange('priority','low')} />
                  Low
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="Enter location or meeting link"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add event description, agenda, or notes"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>
          
          <Button type="submit" variant="hero" size="lg" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;