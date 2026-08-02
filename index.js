const dns = require("dns");

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_DB_URI;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect().catch(console.dir);

const database = client.db("bibliodrop");
const bookCollection = database.collection("books");

app.get('/api/books', async (req, res) => {
    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.status) {
        query.status = req.query.status;
    }
    if (req.query.librarianId) {
        query.librarian = req.query.librarianId;
    }
    const cursor = bookCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
});


app.get('/api/books/:id', async (req, res) => {
    const id = req.params.id;
    const query = {
        _id: new ObjectId(id)
    }
    const result = await bookCollection.findOne(query);
    res.send(result);
})


app.post('/api/books', async (req, res) => {
    const book = req.body;
    const result = await bookCollection.insertOne(book);
    res.send(result);
});


app.put('/api/books/:id', async (req, res) => {
    const id = req.params.id;
    const { _id, ...updateData } = req.body;
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };

    const result = await bookCollection.updateOne(filter, { $set: updateData });
    res.send(result);
});


app.patch('/api/books/:id', async (req, res) => {
    const id = req.params.id;
    const { _id, ...updateData } = req.body;
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };

    const result = await bookCollection.updateOne(filter, { $set: updateData });
    res.send(result);
});


// app.delete('/api/books/:id', async (req, res) => {
//     const id = req.params.id;
//     const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };

//     const result = await bookCollection.deleteOne(filter);
//     res.send(result);
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app;