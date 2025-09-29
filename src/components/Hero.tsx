import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-scheduling.jpg";

interface HeroProps {
  onDemoClick?: () => void;
  onCreateClick?: () => void;
}

const Hero = ({ onDemoClick, onCreateClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Schedule Events
            <span className="block text-gradient">Effortlessly</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Create, manage, and share your events with a beautiful, intuitive scheduling platform. 
            Perfect for meetings, conferences, and social gatherings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="professional" size="lg" className="text-lg px-8 py-4" onClick={onCreateClick}
            >
              <Calendar className="w-5 h-5" />
              Create Your First Event
            </Button>
            <Button variant="ghost" size="lg" className="text-lg px-8 py-4 text-white border-white/30 hover:bg-white/10" onClick={onDemoClick}
            >
              <Users className="w-5 h-5" />
              View Demo
            </Button>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-float">
          <div className="card-gradient p-6 rounded-xl hover-lift text-gray-800">
            <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-sm text-muted-foreground">AI-powered time slot suggestions and conflict detection</p>
          </div>
          
          <div className="card-gradient p-6 rounded-xl hover-lift text-gray-800">
            <Users className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground">Invite attendees and manage group availability</p>
          </div>
          
          <div className="card-gradient p-6 rounded-xl hover-lift text-gray-800">
            <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instant Updates</h3>
            <p className="text-sm text-muted-foreground">Real-time notifications and calendar sync</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;