// Interfaces for the Visitate API responses

// Tour details response
export interface TourDetails {
  id: number;
  name: string;
  type_id: number;
  type_name: string;
  event_id: number;
  event_name: string;
  venue_id: number;
  venue_name: string;
  language_id: number;
  language_name: string;
  duration: number;
  min_participants: number;
  max_participants: number;
  meeting_point: string;
  hint: string;
  image_url: string;
  color: string;
  description_normal: string;
  description_short: string;
  description_long: string;
  days_until_not_bookable: number;
  book_complete_tour: number;
  single_ticketing: number;
  booking_without_tickets: number;
  bookable_customer: number;
  bookable_intern: number;
  categories: TourCategory[];
  prices_online: TourPrice[];
  prices_cashdesk: TourPrice[];
}

export interface TourCategory {
  category_id: string;
  category_name: string;
}

export interface TourPrice {
  id: number;
  name: string;
  description_short: string;
  description_long: string;
  description_intern: string;
  reduced: number;
  amount: number;
}

// Tour dates response
export interface TourDate {
  id: number;
  tour_id: number;
  name: string;
  prices: number[];
  image_url: string;
  duration: number;
  from: number; // Unix timestamp
  to: number; // Unix timestamp
  tours: number;
  av_tours: number;
  part: number;
  av_part: number;
}