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
const run = async() => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("portfolio")
        const collection = db.collection("data")
        const projectCollection = db.collection('project');



        app.post("/api/v1/project", async(req, res) => {
            const { image, title, category, amount, description } = req.body;
            const result = await projectCollection.insertOne({
                image,
                title,
                category,
                amount,
                description,
            });
            res.json({
                success: true,
                message: "Successfully donation create!",
                result,
            });
        });
    } finally {}
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