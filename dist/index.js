"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const visitateService_1 = require("./services/visitateService");
const dataMapper_1 = require("./services/dataMapper");
const mongoDbService_1 = require("./services/mongoDbService");
/**
 * Main application function to import events from Visitate to MongoDB
 *
 * @param cmdLineTourId Optional tour ID from command line
 */
function importEvents(cmdLineTourId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting Visitate event import...');
        const visitateService = new visitateService_1.VisitateService();
        const dataMapper = new dataMapper_1.DataMapper();
        const mongoDbService = new mongoDbService_1.MongoDbService();
        try {
            // Get tour ID from command line args or config
            const tourId = cmdLineTourId || config_1.config.visitate.tourId;
            console.log(`Fetching data for tour ID: ${tourId}`);
            // Fetch data from Visitate API
            const [tourDetails, tourDates] = yield Promise.all([
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
            }
            else {
                console.log('\nNo premiere event detected');
            }
            if (config_1.config.mongodb.skipMongoDB) {
                console.log('\nSkipping MongoDB storage as SKIP_MONGODB=true');
                console.log('\nFirst event document sample:');
                console.log(JSON.stringify(eventDocuments[0], null, 2).substring(0, 500) + '...');
                // Show the EventInfo with ticket URL
                console.log('\nEvent Info with Ticket URL:');
                console.log(JSON.stringify(eventDocuments[0].eventInfos, null, 2));
                console.log('\nImport simulation completed successfully!');
                return;
            }
            // Connect to MongoDB
            yield mongoDbService.connect(config_1.config.mongodb.connectionString, config_1.config.mongodb.dbName);
            // Skip clearing events - will be done manually in MongoDB Atlas
            console.log('Skipping event clearing - will be done manually in MongoDB Atlas');
            // Save events to MongoDB
            const savedIds = yield mongoDbService.saveEvents(eventDocuments);
            console.log(`Saved ${savedIds.length} events to MongoDB`);
            // Close MongoDB connection
            yield mongoDbService.close();
            console.log('Import completed successfully!');
        }
        catch (error) {
            console.error('Error during import:', error);
            // Ensure MongoDB connection is closed even if there's an error
            if (!config_1.config.mongodb.skipMongoDB) {
                yield mongoDbService.close().catch(() => { });
            }
            process.exit(1);
        }
    });
}
/**
 * Parse command-line arguments for tour ID
 *
 * @returns Tour ID if provided, otherwise undefined
 */
function parseTourId() {
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
