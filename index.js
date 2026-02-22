const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());


//mongodb connection


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiaxbve.mongodb.net/?appName=Cluster0`;

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


        //all apis 
        //database 

        const ifterSpotCollection = client.db("IfterSpotDB").collection("ifterSpot");


        app.post('/ifterspot', async (req, res) => {
            const newItem = req.body;
            const result = await ifterSpotCollection.insertOne(newItem);
            res.send(result);
        });


        app.get('/ifterspot', async (req, res) => {
            const result = await ifterSpotCollection.find().toArray();
            res.send(result);
        });

        // Validate 24-char hex ObjectId
        const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

        app.get('/ifterspot/:id', async (req, res) => {
            try {
                const id = req.params.id;
                if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
                const query = { _id: new ObjectId(id) };
                const result = await ifterSpotCollection.findOne(query);
                if (!result) return res.status(404).json({ error: 'Not found' });
                res.send(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.patch('/ifterspot/:id', async (req, res) => {
            try {
                const id = req.params.id;
                if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
                const updatedItem = req.body;
                delete updatedItem._id; // prevent overwriting _id
                const filter = { _id: new ObjectId(id) };
                const updateDoc = { $set: updatedItem };
                const result = await ifterSpotCollection.updateOne(filter, updateDoc);
                if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
                res.send(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.delete('/ifterspot/:id', async (req, res) => {
            try {
                const id = req.params.id;
                if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
                const query = { _id: new ObjectId(id) };
                const result = await ifterSpotCollection.deleteOne(query);
                if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
                res.send(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });











        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`This project is running on port ${port}`)
})
