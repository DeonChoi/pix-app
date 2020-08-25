require('dotenv').config();

const express = require('express');
const mongoose= require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const dbURI = process.env.DB_CONNECTION;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

const userRouter = require('./routes/userRoutes');
const googleRouter = require('./routes/googleRoutes');
const collectionRouter = require('./routes/collectionRoutes');

app.use('/user', userRouter);
app.use('/google', googleRouter);
app.use('/collections', collectionRouter);

// if (process.env.NODE_ENV === 'production') {
    // app.use(express.static('client/build'));
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });
// }




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})