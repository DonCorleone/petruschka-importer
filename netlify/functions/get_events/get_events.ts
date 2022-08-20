import { Handler } from "@netlify/functions";
import { MongoClient } from "mongodb";
import { Movie } from "./models";

export const handler: Handler = async (event, context) => {
  try {
    const uri = process.env.MONGODB_URI;
    const db = process.env.MONGODB_COLLECTION;

    if (uri && db) {
      const mongoClient = new MongoClient(uri);
      const clientPromise = mongoClient.connect();

      const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
      const collection = database.collection<Movie>(db);
      const results = await collection.find({}).limit(20).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(results.map(x => {return x.cast})),
      };
    }else{
      return { statusCode: 500, body: 'no env'};
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
