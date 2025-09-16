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
  }
};