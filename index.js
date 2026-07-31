const dns = require("dns");

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { connect } = require("http2");
const app = express()
const port = 3001
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_DB_URI;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();


client.connect().catch(console.dir)

        const database = client.db("bibliodrop");
        const bookCollection = database.collection("books");
        // const librariansCollection = database.collection("librarians");

        app.get('/api/books', async (req, res) => {
            const query = {};
            if (req.query.category) {
                query.category = req.query.category;
            }
            if (req.query.status) {
                query.status = req.query.status;
            }
            const cursor = bookCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/api/my/books', async (req, res) => {
            const query = {};
            if (req.query.librarianId) {
                query.librarianId = req.query.librarianId;
            }
            const result = bookCollection.findOne(query);
            res.send(result);
        })

        app.post('/api/books', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book);
            res.send(result);
        })

        // app.post('/api/librarians', async (req, res) => {
        //     const librarians = req.body;
        //     const result = await librariansCollection.insertOne(librarians);
        //     res.send(result);
        // })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }
// run().catch(console.dir);

module.exports = app;