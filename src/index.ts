import { config } from './config';
import { VisitateService } from './services/visitateService';
import { DataMapper } from './services/dataMapper';
import { MongoDbService } from './services/mongoDbService';

/**
 * Main application function to import events from Visitate to MongoDB
 * 
 * @param cmdLineTourId Optional tour ID from command line
 */
async function importEvents(cmdLineTourId?: number) {
  console.log('Starting Visitate event import...');

  const visitateService = new VisitateService();
  const dataMapper = new DataMapper();
  const mongoDbService = new MongoDbService();

  try {
    // Get tour ID from command line args or config
    const tourId = cmdLineTourId || config.visitate.tourId;
    console.log(`Fetching data for tour ID: ${tourId}`);

    // Fetch data from Visitate API
    const [tourDetails, tourDates] = await Promise.all([
      visitateService.getTourDetails(tourId),
      visitateService.getTourDates(tourId)
    ]);

    console.log(`Fetched tour details: ${tourDetails.name}`);
    console.log(`Fetched ${tourDates.length} tour dates`);

    // Map data to MongoDB format
    const eventDocuments = dataMapper.mapToMongoDocument(tourDetails, tourDates);
    console.log(`Mapped ${eventDocuments.length} event documents`);
    
    // Find and log the premiere event
    const premiereEvent = eventDocuments.find(event => event.googleAnalyticsTracker === 'Premiere');
    if (premiereEvent) {
      console.log(`\nPremiere event detected on: ${premiereEvent.start.toLocaleDateString()} at ${premiereEvent.start.toLocaleTimeString()}`);
    } else {
      console.log('\nNo premiere event detected');
    }

    if (config.mongodb.skipMongoDB) {
      console.log('\nSkipping MongoDB storage as SKIP_MONGODB=true');
      console.log('\nFirst event document sample:');
      console.log(JSON.stringify(eventDocuments[0], null, 2).substring(0, 500) + '...');
      console.log('\nImport simulation completed successfully!');
      return;
    }

    // Connect to MongoDB
    await mongoDbService.connect(
      config.mongodb.connectionString,
      config.mongodb.dbName
    );

    // Skip clearing events - will be done manually in MongoDB Atlas
    console.log('Skipping event clearing - will be done manually in MongoDB Atlas');
    
    // Save events to MongoDB
    const savedIds = await mongoDbService.saveEvents(eventDocuments);
    console.log(`Saved ${savedIds.length} events to MongoDB`);

    // Close MongoDB connection
    await mongoDbService.close();

    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error during import:', error);
    
    // Ensure MongoDB connection is closed even if there's an error
    if (!config.mongodb.skipMongoDB) {
      await mongoDbService.close().catch(() => {});
    }
    
    process.exit(1);
  }
}

/**
 * Parse command-line arguments for tour ID
 * 
 * @returns Tour ID if provided, otherwise undefined
 */
function parseTourId(): number | undefined {
  // Check for --tour or -t argument
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--tour' || args[i] === '-t') && i + 1 < args.length) {
      const tourId = parseInt(args[i + 1], 10);
      if (!isNaN(tourId)) {
        return tourId;
      }
    }
  }
  return undefined;
}

// Parse command-line arguments
const tourId = parseTourId();

// Run the import
importEvents(tourId).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
