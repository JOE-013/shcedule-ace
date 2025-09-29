import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees: number;
  category: string;
  isUpcoming?: boolean;
}

const EventCard = ({ 
  title, 
  date, 
  time, 
  location, 
  attendees, 
  category, 
  isUpcoming = false 
}: EventCardProps) => {
  return (
    <Card className="hover-lift transition-all duration-300 border-0 shadow-sm hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant={isUpcoming ? "default" : "secondary"} className="mb-2">
            {category}
          </Badge>
          {isUpcoming && (
            <Badge variant="outline" className="text-success border-success">
              Upcoming
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2 text-primary" />
          {date}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          {time}
        </div>
        
        {location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {location}
          </div>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2 text-primary" />
          {attendees} {attendees === 1 ? 'attendee' : 'attendees'}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;