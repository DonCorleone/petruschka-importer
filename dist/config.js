"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
exports.config = {
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
