import { MongoClient, Db, Collection } from 'mongodb';
import { EventDocument } from '../models/mongodb';

export class MongoDbService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private eventsCollection: Collection<EventDocument> | null = null;

  /**
   * Initializes the MongoDB connection
   * 
   * @param connectionString MongoDB connection string
   * @param dbName Database name
   */
  async connect(connectionString: string, dbName: string): Promise<void> {
    try {
      console.log(`Attempting to connect to MongoDB at ${connectionString}`);
      this.client = await MongoClient.connect(connectionString);
      this.db = this.client.db(dbName);
      this.eventsCollection = this.db.collection<EventDocument>('events');
      console.log(`Connected to MongoDB database: ${dbName}`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      console.error('\nPossible solutions:');
      console.error('1. Make sure MongoDB is running on your system');
      console.error('2. Check the MONGODB_URI in your .env file');
      console.error('3. If using Atlas, ensure your IP is whitelisted and credentials are correct');
      console.error('\nAlternatively, you can run without MongoDB to just fetch and transform data:');
      console.error('Set SKIP_MONGODB=true in your .env file\n');
      throw new Error('Failed to connect to MongoDB');
    }
  }

  /**
   * Clears all events from the collection
   */
  async clearEvents(): Promise<void> {
    if (!this.eventsCollection) {
      throw new Error('MongoDB is not connected');
    }

    try {
      const result = await this.eventsCollection.deleteMany({});
      console.log(`Cleared ${result.deletedCount} events from collection`);
    } catch (error) {
      console.error('Error clearing events from MongoDB:', error);
      throw new Error('Failed to clear events from MongoDB');
    }
  }

  /**
   * Saves event documents to MongoDB
   * 
   * @param events Array of event documents to save
   * @returns Array of inserted IDs
   */
  async saveEvents(events: EventDocument[]): Promise<number[]> {
    if (!this.eventsCollection) {
      throw new Error('MongoDB is not connected');
    }

    try {
      const results = [];
      
      // Insert events one by one to handle individual errors
      for (const event of events) {
        try {
          // First check if the event already exists
          const existing = await this.eventsCollection.findOne({ _id: event._id });
          
          if (existing) {
            // Replace the existing document
            await this.eventsCollection.replaceOne({ _id: event._id }, event);
            console.log(`Updated existing event with ID ${event._id}`);
          } else {
            // Insert new document
            await this.eventsCollection.insertOne(event);
            console.log(`Inserted new event with ID ${event._id}`);
          }
          
          results.push(event._id);
        } catch (error) {
          console.error(`Error saving event ${event._id}:`, error);
        }
      }

      return results;
    } catch (error) {
      console.error('Error saving events to MongoDB:', error);
      throw new Error('Failed to save events to MongoDB');
    }
  }

  /**
   * Closes the MongoDB connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }
}