const { ChromaClient } = require("chromadb");


const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

async function run() {
  const collections = await client.listCollections();
  console.log("Collections:", collections);

  if (collections.length > 0) {
    const col = await client.getCollection({
      name: collections[0].name,
    });

    const data = await col.get();
    console.log("Data:", data);
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


// run();
// getById()
const { YoutubeTranscript } = require("youtube-transcript");

async function test() {
  const data = await YoutubeTranscript.fetchTranscript("qyfekrNni90");
  console.log(data);
}

test();