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
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Schedule Events
            <span className="block text-gradient">Effortlessly</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Create, manage, and share your events with a beautiful, intuitive scheduling platform. 
            Perfect for meetings, conferences, and social gatherings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
            <Button variant="professional" size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4" onClick={onCreateClick}
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              Create Your First Event
            </Button>
            <Button variant="ghost" size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 text-white border-white/30 hover:bg-white/10" onClick={onDemoClick}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              View Demo
            </Button>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 animate-float px-4">
          <div className="card-gradient p-4 md:p-6 rounded-xl hover-lift text-gray-800">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-xs md:text-sm text-muted-foreground">AI-powered time slot suggestions and conflict detection</p>
          </div>
          
          <div className="card-gradient p-4 md:p-6 rounded-xl hover-lift text-gray-800">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Invite attendees and manage group availability</p>
          </div>
          
          <div className="card-gradient p-4 md:p-6 rounded-xl hover-lift text-gray-800">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">Instant Updates</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Real-time notifications and calendar sync</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;