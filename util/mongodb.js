import { MongoClient } from "mongodb";

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

/* 
Global is used here to maintain a cached connection across hot reloads
in development. This prevents connections growing exponentially
during API Route usage.
*/

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        // MONGODB_DB is from the .env variables that we set
        db: client.db(MONGODB_DB),
        /*  you can add more Databases if you'd like
        ex: 
        client,
        db: client.db(MONGO_DB),
        backup_db: client.db("blah blah"),
        third_db: client.db("whatevers etc...")
        
        */
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
