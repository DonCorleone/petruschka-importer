# Petruschka Importer

This application imports event data from the Visitate ticketing system API and stores it in a MongoDB database for use by the Petruschka application.

## Features

- Fetches tour details and dates from the Visitate API
- Transforms the data into the required MongoDB format
- Stores the events in MongoDB
- Supports updating existing events
- Configurable via environment variables

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root based on the `.env.example` file
4. Set your MongoDB URI and database name in the `.env` file

## Configuration

The application can be configured using the following environment variables:

- `MONGODB_URI`: The MongoDB connection string (default: `mongodb://localhost:27017`)
- `MONGODB_DB_NAME`: The name of the MongoDB database (default: `petruschka`)
- `SKIP_MONGODB`: Set to `true` to skip MongoDB connection and just print the transformed data (useful for debugging)
- `VISITATE_TOUR_ID`: The ID of the tour to import (default: `34`)
- `LOG_LEVEL`: The log level for the application (default: `info`)

## Usage

### Running the Importer

To run the Visitate importer:

```bash
# Quick run using ts-node (no build required)
npm run importer

# Build and run the compiled version
npm run importer:start

# Development mode with hot reloading
npm run importer:dev

# Specify a different tour ID
npm run importer -- --tour 42
# or with the short flag
npm run importer -- -t 42
# or use the convenience script
npm run importer:tour 42
```

### Debugging

You can debug the application in VS Code using the following launch configurations:

1. **Debug Importer** - Compiles TypeScript first then runs with Node.js and debugging enabled
2. **Debug Importer (ts-node)** - Runs directly with ts-node for faster development iteration

Simply select one of these configurations in VS Code's Debug panel and press F5 to start debugging.

### Legacy Application

The original Netlify application can still be run with:

```bash
npm start
```

### Netlify Functions (Original functionality)

VS Code:

RUN AND DEBUG "netlify functions:serve" (NODE_OPTIONS=--inspect netlify functions:serve)

Open:
call http://localhost:xyz/.netlify/functions/manage-ef-background from external terminal!

## How it works

1. The application connects to the MongoDB database
2. It fetches tour details from the xxxx API
3. It fetches tour dates for the specified tour
4. It transforms the data into the required MongoDB format
5. It identifies the premiere event (first upcoming event) and marks it
6. It saves the events to the MongoDB database
   - If an event with the same ID exists, it updates the existing event
   - Otherwise, it inserts a new event
   - Note: The application no longer deletes existing events before import; this must be done manually in MongoDB Atlas

## Data Structure

The application fetches data from two xxxx API endpoints:

1. Tour details: `https://xxxx/service/web/infofeed/public/tour/{tourId}`
2. Tour dates: `https://xxxx/service/web/infofeed/public/tourAvasShort`

The data is then transformed into the MongoDB schema required by the Petruschka application. The application focuses on German language content (languageId = 0) as requested.

## License

MIT
