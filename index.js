const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// mongodb server

const uri = "mongodb+srv://sakilkhan882sk:od2jQqHiCAYPmbNW@cluster0.30m8trb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    app.get('/users', async(req, res) => {
    const result = await userCollection.find().toArray();
    res.send(result);
    })

    app.get('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.findOne(query)
        res.send(result);
    })

    app.post('/users', async(req, res) => {
    const user = req.body;
    console.log('new user', user);
    const result = await userCollection.insertOne(user);
     res.send(result);
    })

   app.put('/users/:id', async(req, res) => {
    const id = req.params.id;
    const user = req.body;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const UpdatedUser = {
        $set: {
            name: user.name,
            email: user.email,
        }
    }

    const result = await userCollection.updateOne(filter, UpdatedUser, options);
    res.send(result);
   });

   app.delete('/users/:id', async(req, res) => {
    const id = req.params.id;
    console.log('delete user', id);
    const query = {_id: new ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result);
   })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`);
});