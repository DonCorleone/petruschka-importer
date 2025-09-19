import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  // MongoDB configuration
  mongodb: {
    connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'petruschka',
    skipMongoDB: process.env.SKIP_MONGODB === 'true',
  },
  
  // Visitate configuration
  visitate: {
    tourId: parseInt(process.env.VISITATE_TOUR_ID || '34', 10),
  },
  
  // Application configuration
  app: {
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  
  // Custom Event Data - Will override data from Visitate API when present
  customData: {
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID,
    location: process.env.LOCATION,
    artists: process.env.ARTISTS,
    shortDescription: process.env.SHORT_DESCRIPTION,
    longDescription: process.env.LONG_DESCRIPTION,
  },
  
  // Ticket URL configuration
  tickets: {
    urlTemplate: process.env.TICKET_URL_TEMPLATE || 'https://reservation.museumluzern.ch/de/guided-tours/{{eventId}}?date={{date}}&time={{time}}',
  },
  
  // Image path configuration
  images: {
    bannerTemplate: process.env.BANNER_IMAGE_TEMPLATE || 'https://petruschka.netlify.app/assets/images/main/landscape/{{eventId}}.jpg',
    flyerTemplate: process.env.FLYER_IMAGE_TEMPLATE || 'https://petruschka.netlify.app/assets/images/main/portrait/{{eventId}}.jpg',
  }
};