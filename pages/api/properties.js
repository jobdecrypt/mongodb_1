/* 
A simple express API endpoint that runs on the backend 

to access it go to localhost:port/api/properties
*/

// to import the function "connectToDatabase" from "util" folder, under the file mongodb.js
import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  // to connect into the database
  const { db } = await connectToDatabase();
  // to get the collection named "listingsAndReviews" under the "sample_airbnb" Database
  // also to find with a limit of "20" to an Array
  const data = await db
    .collection("listingsAndReviews")
    .find({})
    .limit(20)
    .toArray();
  // to respond with a json data
  res.json(data);
}
