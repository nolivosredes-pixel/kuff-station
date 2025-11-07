export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  description: string;
  flyer: string;
  ticketLink: string;
  address: string;
  embedMap: string;
  photos: string[];
}

export interface EventsData {
  events: Event[];
}
