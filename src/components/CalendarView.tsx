import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import ConflictGraph from "@/components/ConflictGraph";
import { useEventStore } from "@/lib/store";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const userEvents = useEventStore(s => s.events);

  // Adapt events (user) into ConflictGraph input for the current visible month
  const graphEvents = useMemo(() => {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const merged = userEvents.map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time,
      durationMinutes: e.durationMinutes,
      priority: e.priority ?? 0,
      createdAtMs: e.createdAtMs,
    }));
    return merged
      .filter(e => e.date.startsWith(`${yyyy}-${mm}-`))
      ;
  }, [currentDate]);

  const formatDate = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const eventsOnSelectedDay = useMemo(() => {
    if (!selectedDate) return [] as typeof userEvents;
    return userEvents
      .filter(e => e.date === selectedDate)
      .slice()
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, userEvents]);

  const upcoming = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0,10);
    return userEvents
      .filter(e => e.date >= todayStr)
      .slice()
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 5);
  }, [userEvents]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Calendar Header */}
      <Card className="animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="p-2 h-20"></div>
            ))}
            
            {days.map(day => (
              <div
                key={day}
                onClick={() => setSelectedDate(formatDate(currentDate.getFullYear(), currentDate.getMonth()+1, day))}
                className={`border rounded-lg p-2 h-20 hover:bg-accent/50 transition-colors cursor-pointer ${selectedDate === formatDate(currentDate.getFullYear(), currentDate.getMonth()+1, day) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="text-sm font-medium">{day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <div className="text-sm text-muted-foreground">No upcoming events</div>
            )}
            {upcoming.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.date} at {e.time}</div>
                  </div>
                </div>
                <Badge variant="outline">{(e.priority ?? 0) === 0 ? 'High' : 'Low'}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events on selected day */}
      {selectedDate && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Events on {selectedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventsOnSelectedDay.length === 0 && (
                <div className="text-sm text-muted-foreground">No events on this day</div>
              )}
              {eventsOnSelectedDay.map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-sm text-muted-foreground">{e.time} • {e.durationMinutes}m</div>
                    </div>
                  </div>
                  <Badge variant="outline">{(e.priority ?? 0) === 0 ? 'High' : 'Low'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conflict Graph Section */}
      <div className="rounded-xl border p-2 bg-gradient-to-br from-background to-accent/20">
        <ConflictGraph events={graphEvents} />
      </div>
    </div>
  );
};

export default CalendarView;