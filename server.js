const express = require('express');
const mongoose= require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const dbURI = process.env.DB_CONNECTION;
// console.log(dbURI)
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    res.send(req.body)
    console.log(req.body)
})




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})