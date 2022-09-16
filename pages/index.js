import Head from "next/head";
// to import mongodb from the "util" folder
import { connectToDatabase } from "../util/mongodb";

export default function Home({ properties }) {
  // to check properties in the browser console
  console.log(properties);

  return (
    <div>
      <Head>
        <title>MongoDB Sample 1</title>
        <link rel="icon" href="/favicon.ico"></link>
        {/* import minified css package from tailwindcss */}
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <div class="container mx-auto">
        <div class="flex">
          <div class="row w-full text-center my-4">
            <h1 class="text-4xl font-bold mb-5">MongoDB Sample 1</h1>
          </div>
        </div>
        <div class="flex flex-row flex-wrap">
          {properties &&
            properties.map((property) => (
              <div class="flex-auto w-1/4 rounded overflow-hidden shadow-lg m-2">
                <img class="w-full" src={property.image} />
                <div class="px-6 py-4">
                  <div class="font-bold text-xl mb-2">
                    {property.name} (Up to {property.beds} guests)
                  </div>
                  <p>{property.address.street}</p>
                  <p class="text-gray-700 text-base">{property.summary}</p>
                </div>

                <div class="text-center py-2 my-2 font-bold">
                  <span class="text-green-500">${property.price}</span>/night
                </div>

                <div class="text-center py-2 my-2 font-bold">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-5 rounded">
                    Book
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// this will not going to go to the browser
export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  // to get the collection named "listingsAndReviews" under the "sample_airbnb" Database
  // also to find with a limit of "20" to an Array
  // the .project function is to just get the specific fields that we asked for
  const data = await db
    .collection("listingsAndReviews")
    .find({})
    .limit(20)
    .toArray();
  // .project({ _id: 1, image: 1, description: 1 });

  // to parse the data to display in the browser
  const properties = JSON.parse(JSON.stringify(data));

  // to filter a lot of data
  const filtered = properties.map((property) => {
    // to parse the Decimal number ("$") sign of the price
    const price = JSON.parse(JSON.stringify(property.price));
    return {
      //props
      _id: property._id,
      name: property.name,
      image: property.images.picture_url,
      address: property.address,
      summary: property.summary,
      beds: property.beds,
      price: price.$numberDecimal,
    };
  });

  return {
    props: { properties: filtered },
  };
}
