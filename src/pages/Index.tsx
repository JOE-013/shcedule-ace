import { useState } from "react";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import CalendarView from "@/components/CalendarView";
import EventForm from "@/components/EventForm";
import EventCard from "@/components/EventCard";

const Index = () => {
  const [currentView, setCurrentView] = useState('home');

  // Sample events for demonstration
  const sampleEvents = [
    {
      title: "Weekly Team Meeting",
      date: "Jan 15, 2024",
      time: "2:00 PM - 3:00 PM",
      location: "Conference Room A",
      attendees: 8,
      category: "Meeting",
      isUpcoming: true
    },
    {
      title: "Product Launch Event",
      date: "Jan 20, 2024", 
      time: "10:00 AM - 6:00 PM",
      location: "Main Auditorium",
      attendees: 150,
      category: "Conference",
      isUpcoming: true
    },
    {
      title: "Design Workshop",
      date: "Jan 25, 2024",
      time: "1:00 PM - 4:00 PM",
      attendees: 12,
      category: "Workshop",
      isUpcoming: false
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'create':
        return (
          <div className="pt-24 px-6 min-h-screen bg-gradient-to-br from-accent to-secondary/30">
            <EventForm />
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <Hero />
            
            {/* Recent Events Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-accent to-secondary/30">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Events</h2>
                  <p className="text-lg text-muted-foreground">Manage and track all your scheduled events</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleEvents.map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
