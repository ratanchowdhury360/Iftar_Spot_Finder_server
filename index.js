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
        const reviewCollection = client.db("IfterreviewDB").collection("ifterReview");
        const commentCollection = client.db("CommentDB").collection("comments");

        // Validate 24-char hex ObjectId (used by comment & ifterspot routes)
        const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

        // Comment APIs
        app.post('/comment', async (req, res) => {
            const newItem = req.body;
            const result = await commentCollection.insertOne(newItem);
            const inserted = await commentCollection.findOne({ _id: result.insertedId });
            res.send(inserted);
        });
        app.get('/comment', async (req, res) => {
            const result = await commentCollection.find().toArray();
            res.send(result);
        });
        app.get('/comment/spot/:spotId', async (req, res) => {
            const spotId = req.params.spotId;
            const result = await commentCollection.find({ spotId }).sort({ createdAt: 1 }).toArray();
            res.send(result);
        });
        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const query = { _id: new ObjectId(id) };
            const result = await commentCollection.findOne(query);
            if (!result) return res.status(404).json({ error: 'Not found' });
            res.send(result);
        });
        app.patch('/comment/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const updatedItem = req.body;
            delete updatedItem._id; // prevent overwriting _id
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedItem };
            const result = await commentCollection.updateOne(filter, updateDoc);
            if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
            const updated = await commentCollection.findOne(filter);
            res.send(updated);
        });
        app.put('/comment/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const updatedItem = req.body;
            delete updatedItem._id; // prevent overwriting _id
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedItem };
            const result = await commentCollection.updateOne(filter, updateDoc);
            if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
            const updated = await commentCollection.findOne(filter);
            res.send(updated);
        });
        app.delete('/comment/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const query = { _id: new ObjectId(id) };
            const result = await commentCollection.deleteOne(query);
            if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
            res.send(result);
        });
        app.get('/comment/user/:email', async (req, res) => {   
            const email = req.params.email;
            const query = { email: email };
            const result = await commentCollection.find(query).toArray();
            res.send(result);
        });
        app.delete('/comment/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await commentCollection.deleteMany(query);
            res.send(result);
        });

        app.post('/ifterspot', async (req, res) => {
            const newItem = req.body;
            const result = await ifterSpotCollection.insertOne(newItem);
            res.send(result);
        });


        app.get('/ifterspot', async (req, res) => {
            const result = await ifterSpotCollection.find().toArray();
            res.send(result);
        });

        console.log('Registering review routes');
        app.post('/review', async (req, res) => {
            const newItem = req.body;
            const result = await reviewCollection.insertOne(newItem);
            res.send(result);
        });
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        });
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const query = { _id: new ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            if (!result) return res.status(404).json({ error: 'Not found' });
            res.send(result);
        });
        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const updatedItem = req.body;
            delete updatedItem._id; // prevent overwriting _id
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedItem };
            const result = await reviewCollection.updateOne(filter, updateDoc);
            if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
            const updated = await reviewCollection.findOne(filter);
            res.send(updated);
        });
        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const updatedItem = req.body;
            delete updatedItem._id; // prevent overwriting _id
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedItem };
            const result = await reviewCollection.updateOne(filter, updateDoc);
            if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
            const updated = await reviewCollection.findOne(filter);
            res.send(updated);
        });
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
            const query = { _id: new ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
            res.send(result);
        });
        app.get('/review/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await reviewCollection.find(query).toArray();
            res.send(result);
        });
        app.delete('/review/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await reviewCollection.deleteMany(query);
            res.send(result);
        });

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

        const handleUpdateSpot = async (req, res) => {
            try {
                const id = req.params.id;
                if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
                const updatedItem = req.body;
                delete updatedItem._id; // prevent overwriting _id
                const filter = { _id: new ObjectId(id) };
                const updateDoc = { $set: updatedItem };
                const result = await ifterSpotCollection.updateOne(filter, updateDoc);
                if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
                const updated = await ifterSpotCollection.findOne(filter);
                res.send(updated);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
        app.patch('/ifterspot/:id', handleUpdateSpot);
        app.put('/ifterspot/:id', handleUpdateSpot);

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

// Diagnostic endpoint: list registered routes
app.get('/_routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((m) => {
        if (m.route && m.route.path) {
            routes.push({ path: m.route.path, methods: Object.keys(m.route.methods) });
        } else if (m.name === 'router' && m.handle && m.handle.stack) {
            m.handle.stack.forEach((n) => {
                if (n.route && n.route.path) {
                    routes.push({ path: n.route.path, methods: Object.keys(n.route.methods) });
                }
            });
        }
    });
    res.json(routes);
});

// Only start a local server when not running on Vercel (serverless)
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`This project is running on port ${port}`)
    })
}

// Export the app so Vercel's @vercel/node can use it as a serverless handler
module.exports = app;
