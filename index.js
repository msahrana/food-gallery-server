const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crgl3kb.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // await client.connect();

    const foodCollection = client.db('foodDB').collection('food');
    const userCollection = client.db('foodDB').collection('user');
    const newFoodCollection = client.db('foodDB').collection('request');

    app.post('/food', async(req, res)=>{
      const newFood = req.body;
      console.log(newFood)
      const result = await foodCollection.insertOne(newFood)
      res.send(result)
    })

    app.get('/food', async(req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    })

    app.get('/food/:id', async(req, res) => {
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await foodCollection.findOne(query)
      res.send(result)
    })

    app.post('/user', async(req, res) => {
      const user = req.body 
      console.log(user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.post('/request', async(req, res) => {
      const requestFood = req.body 
      console.log(requestFood)
      const result = await newFoodCollection.insertOne(requestFood)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {


  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Food-Gallery server is running')
})

app.listen(port, ()=>{
    console.log(`Food-Gallery server is running on port: ${port}`)
})