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
exports.MongoDbService = void 0;
const mongodb_1 = require("mongodb");
class MongoDbService {
    constructor() {
        this.client = null;
        this.db = null;
        this.eventsCollection = null;
    }
    /**
     * Initializes the MongoDB connection
     *
     * @param connectionString MongoDB connection string
     * @param dbName Database name
     */
    connect(connectionString, dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Attempting to connect to MongoDB at ${connectionString}`);
                this.client = yield mongodb_1.MongoClient.connect(connectionString);
                this.db = this.client.db(dbName);
                this.eventsCollection = this.db.collection('events');
                console.log(`Connected to MongoDB database: ${dbName}`);
            }
            catch (error) {
                console.error('Error connecting to MongoDB:', error);
                console.error('\nPossible solutions:');
                console.error('1. Make sure MongoDB is running on your system');
                console.error('2. Check the MONGODB_URI in your .env file');
                console.error('3. If using Atlas, ensure your IP is whitelisted and credentials are correct');
                console.error('\nAlternatively, you can run without MongoDB to just fetch and transform data:');
                console.error('Set SKIP_MONGODB=true in your .env file\n');
                throw new Error('Failed to connect to MongoDB');
            }
        });
    }
    /**
     * Saves event documents to MongoDB
     *
     * @param events Array of event documents to save
     * @returns Array of inserted IDs
     */
    saveEvents(events) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.eventsCollection) {
                throw new Error('MongoDB is not connected');
            }
            try {
                const results = [];
                // Insert events one by one to handle individual errors
                for (const event of events) {
                    try {
                        // Check if event with this ID already exists
                        const existingEvent = yield this.eventsCollection.findOne({ _id: event._id });
                        if (existingEvent) {
                            // Update existing event
                            yield this.eventsCollection.replaceOne({ _id: event._id }, event);
                            console.log(`Updated event with ID ${event._id}`);
                        }
                        else {
                            // Insert new event
                            yield this.eventsCollection.insertOne(event);
                            console.log(`Inserted new event with ID ${event._id}`);
                        }
                        results.push(event._id);
                    }
                    catch (error) {
                        console.error(`Error saving event ${event._id}:`, error);
                    }
                }
                return results;
            }
            catch (error) {
                console.error('Error saving events to MongoDB:', error);
                throw new Error('Failed to save events to MongoDB');
            }
        });
    }
    /**
     * Closes the MongoDB connection
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                yield this.client.close();
                console.log('MongoDB connection closed');
            }
        });
    }
}
exports.MongoDbService = MongoDbService;
