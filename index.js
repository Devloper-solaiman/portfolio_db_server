const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: 'https://localhost:5000',
    credentials: true
}));
app.use(express.json());



// mongodb Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});
const run = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("portfolio")
        const collection = db.collection("data")
        const ProjectCollection = db.collection('project');



        app.post("/api/v1/project", async (req, res) => {
            const { _id, image, title, liveLink, clientLink, serverLink, technology, keyFeature, ratting, description } = req.body;
            const result = await ProjectCollection.insertOne({ _id, image, title, liveLink, clientLink, serverLink, technology, keyFeature, ratting, description });
            res.json({
                success: true,
                message: "Successfully Project create!",
                result,
            });
        });

        app.get("/api/v1/project", async (req, res) => {
            const data = await ProjectCollection.find({}).toArray();
            res.json({
                success: true,
                message: "successfully retrieve Projects!",
                data,
            });
        });

        app.delete("/api/v1/project/:id", async (req, res) => {
            const { id } = req.params;
            const data = await ProjectCollection.deleteOne({
                _id: new ObjectId(id),
            });
            res.json({
                success: true,
                message: "successfully delete donation!",
                data,
            });
        });

    } finally { }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});

// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});