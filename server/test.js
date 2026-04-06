const { ChromaClient } = require("chromadb");


const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

// async function run() {
//   const collections = await client.listCollections();
//   console.log("Collections:", collections);

//   if (collections.length > 0) {
//     const col = await client.getCollection({
//       name: collections[0].name,
//     });

//     const data = await col.get();
//     console.log("Data:", data);
//   }
// }


async function run() {
  const collections = await client.listCollections();
  console.log("Collections:", collections);

  if (collections.length > 0) {
    const col = await client.getCollection({
      name: collections[0].name,
    });

    // 1. Basic stats
    const count = await col.count();
    console.log("Total chunks:", count);

    // 2. Get data WITH embeddings
    const data = await col.get({
      include: ["embeddings", "documents", "metadatas"],
    });
    console.log("Documents:", data.documents.slice(0, 3));   // first 3 chunks
    console.log("Metadatas:", data.metadatas.slice(0, 3));   // first 3 metadata
    console.log("Embeddings:", data.embeddings?.[0]);        // first embedding vector

    // 3. Test similarity search is actually working
    const results = await col.query({
      queryTexts: ["binary search"],
      nResults: 3,
      include: ["documents", "metadatas", "distances"],
    });
    console.log("Query results:", results.documents);
    console.log("Distances:", results.distances); // lower = more similar
    
    // 4. Check how many chunks per source
    const sources = data.metadatas
      ?.map((m) => m?.source)
      .filter(Boolean);
    const grouped = sources?.reduce((acc, src) => {
      acc[src ] = (acc[src ] || 0) + 1;
      return acc;
    }, {});
    console.log("Chunks per source:", grouped);
  }
}

async function getById() {
  const collection = await client.getCollection({
    name: "Second-brain",
  });

  const data = await collection.get({
    ids: ["69d357aa37f7e94f595c25cf"], // 🔥 your ID
    include: ["documents", "metadatas", "embeddings"],
  });

  console.log(data);
}



async function reset() {
  const collections = await client.listCollections();

  for (const col of collections) {
    console.log("Deleting:", col.name);
    await client.deleteCollection({ name: col.name });
  }

  console.log("✅ All collections deleted");
}

// reset()
// run();