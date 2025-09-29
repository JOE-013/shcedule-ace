import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import calendarImage from "@/assets/calendar-illustration.jpg";
import { useState } from "react";

// Sample events data
const sampleEvents = [
  { id: 1, title: "Team Standup", time: "09:00", date: "2024-01-15", category: "Meeting" },
  { id: 2, title: "Product Demo", time: "14:00", date: "2024-01-15", category: "Conference" },
  { id: 3, title: "Design Review", time: "10:30", date: "2024-01-16", category: "Workshop" },
  { id: 4, title: "Client Call", time: "16:00", date: "2024-01-17", category: "Meeting" },
  { id: 5, title: "Team Lunch", time: "12:00", date: "2024-01-18", category: "Social" },
];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
                className="border rounded-lg p-2 h-20 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium">{day}</div>
                {/* Sample event indicators */}
                {day === 15 && (
                  <div className="space-y-1 mt-1">
                    <div className="text-xs bg-primary text-primary-foreground px-1 rounded truncate">
                      Standup
                    </div>
                    <div className="text-xs bg-success text-success-foreground px-1 rounded truncate">
                      Demo
                    </div>
                  </div>
                )}
                {day === 16 && (
                  <div className="text-xs bg-secondary text-secondary-foreground px-1 rounded truncate mt-1">
                    Review
                  </div>
                )}
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
            {sampleEvents.map(event => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.date} at {event.time}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{event.category}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;