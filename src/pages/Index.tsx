import { useState } from "react";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import CalendarView from "@/components/CalendarView";
import EventForm from "@/components/EventForm";
import EventCard from "@/components/EventCard";
import DemoView from "@/components/DemoView";
import { useEventStore } from "@/lib/store";

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const events = useEventStore(s => s.events);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'create':
        return (
          <div className="pt-20 md:pt-24 px-4 md:px-6 min-h-screen bg-gradient-to-br from-accent to-secondary/30">
            <EventForm onCreated={() => setCurrentView('home')} />
          </div>
        );
      case 'demo':
        return (
          <div className="pt-20 md:pt-24 px-4 md:px-6 min-h-screen bg-gradient-to-br from-accent to-secondary/30">
            <DemoView />
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <Hero onDemoClick={() => setCurrentView('demo')} onCreateClick={() => setCurrentView('create')} />
            
            {/* Your Events */}
            <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-accent to-secondary/30">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Your Events</h2>
                  <p className="text-base md:text-lg text-muted-foreground">Manage and track all your scheduled events</p>
                </div>
                
                {events.length === 0 ? (
                  <div className="text-center text-muted-foreground">No events yet. Create your first event above.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {events.map((e) => (
                      <EventCard
                        key={e.id}
                        title={e.title}
                        date={e.date}
                        time={`${e.time} - ${e.durationMinutes}m`}
                        location={e.location}
                        attendees={0}
                        category={(e.priority ?? 0) === 0 ? 'High' : 'Low'}
                        isUpcoming
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={(v) => setCurrentView(v)} />
      {/* Auto-redirect to home after event creation handled by toast + user flow */}
      {renderCurrentView()}
    </div>
  );
};

export default Index;
