const express = require('express');
const mongoose= require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./routes/verifyToken');

require('dotenv').config();

const GoogleUser = require('./models/google.user.model');
const User = require('./models/user.model');
const Photo = require('./models/photo.model');

const { registerValidation, loginValidation, googleLoginValidation, googleRegisterValidation }= require('./routes/validation');


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const dbURI = process.env.DB_CONNECTION;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
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

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.post('/user/login', async (req, res) => {
//     const {error} = loginValidation(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     };
//
//     const validUser = await User.findOne({email: req.body.email});
//     if (!validUser) {
//         return res.status(400).send('Email is not found');
//     };
//
//     const validPass = await bcrypt.compare(req.body.password, validUser.password);
//     if (!validPass) {
//         return res.status(400).send('Invalid password');
//     };
//
//     //create and assign a token
//     const token = jwt.sign({_id: validUser._id}, process.env.TOKEN_SECRET);
//     res.header('auth-token', token).json({token, email: validUser.email});
// })
//
// app.post('/user/register', async (req, res) => {
//     const {error} = registerValidation(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     };
//
//     const emailExist = await User.findOne({email: req.body.email});
//     if (emailExist) {
//         console.log(emailExist)
//         return res.status(400).send({
//             message: 'This email already exists!'
//         });
//     };
//
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     const user = new User({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: hashedPassword
//     });
//
//     try {
//         await user.save();
//         res.send({user: user._id});
//         console.log(user)
//         console.log('User Saved')
//     }
//     catch (err) {
//         res.status(400).send(err);
//     }
// })
//
// app.post('/google/register', async (req, res) => {
//     const {error} = googleRegisterValidation(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     };
//
//     const emailExist = await GoogleUser.findOne({email: req.body.email});
//     if (emailExist) {
//         console.log(emailExist)
//         return res.status(400).send({
//             message: 'This email already exists!'
//         });
//     };
//
//     const user = new GoogleUser({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//     });
//
//     try {
//         await user.save();
//         res.send({user: user._id});
//         console.log(user)
//         console.log('User Saved')
//     }
//     catch (err) {
//         res.status(400).send(err);
//     }
// })
//
// app.post('/google/login', async (req, res) => {
//     const {error} = googleLoginValidation(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     };
//     const validUser = await GoogleUser.findOne({email: req.body.email});
//     if (!validUser) {
//         return res.status(400).send('Email is not found');
//     };
//     res.send('Logged in!')
// })

// app.post('/collections/add', verify, async (req, res) => {
//     if (!req.headers.email) {
//         let userID = req.user._id;
//         let photoID = req.body.photoID;
//
//         try {
//             let photo = await Photo.findOne({ photoID, userID });
//
//             if (photo) {
//                 return res.json('Image already saved!')
//             } else {
//                 photo = new Photo({
//                     photoID: photoID,
//                     userID: userID,
//                     altDescription: req.body.altDescription,
//                     urlsSmall: req.body.urlsSmall,
//                     urlsRegular: req.body.urlsRegular,
//                     urlsThumb: req.body.urlsThumb,
//                     urlsRaw: req.body.urlsRaw,
//                     date: new Date()
//                 });
//                 photo.save()
//                     .then( () => {
//                         res.json('Image saved!');
//                     })
//                     .catch( err => {
//                         console.log(err)
//                         res.status(400).json('Error: ' + err)
//                     });
//             }
//         } catch (err) {
//             console.error(err);
//             res.status(500).json('Server Error');
//         }
//     } else if (req.headers.email) {
//         let userEmail = req.headers.email;
//         let photoID = req.body.photoID;
//
//         try {
//             let googleUser = await GoogleUser.findOne({email: userEmail});
//             let photo = await Photo.findOne({ photoID: photoID, userID: googleUser._id });
//             if (photo) {
//                 return res.json('Image already saved!')
//             } else {
//                 photo = new Photo({
//                     photoID: photoID,
//                     userID: googleUser._id,
//                     altDescription: req.body.altDescription,
//                     urlsSmall: req.body.urlsSmall,
//                     urlsRegular: req.body.urlsRegular,
//                     urlsThumb: req.body.urlsThumb,
//                     urlsRaw: req.body.urlsRaw,
//                     date: new Date()
//                 });
//                 photo.save()
//                     .then( () => {
//                         res.json('Image saved!');
//                     })
//                     .catch( err => {
//                         console.log(err)
//                         res.status(400).json('Error: ' + err)
//                     });
//             }
//         } catch (err) {
//             console.error(err);
//             res.status(500).json('Server Error');
//         }
//     }
//
// })
//
// app.get('/collections/get', verify, async (req, res) => {
//     if (!req.headers.email) {
//         await Photo.find({userID: req.user._id})
//             .then(photos => {
//                 console.log(photos)
//                 res.json(photos)
//             })
//             .catch(err => res.status(400).json('Error: ' + err));
//     } else if (req.headers.email) {
//         let userEmail = req.headers.email;
//         let googleUser = await GoogleUser.findOne({email: userEmail});
//
//         await Photo.find({userID: googleUser._id})
//             .then(photos => {
//                 console.log(photos)
//                 res.json(photos)
//             })
//             .catch(err => res.status(400).json('Error: ' + err));
//     }
// })
//
// app.delete('/collections/:id', verify, async (req,res) => {
//     if (!req.headers.email) {
//         await Photo.findOneAndDelete({photoID: req.params.id, userID: req.user._id})
//             .then(photos => res.json('Photo deleted!'))
//             .catch(err => res.status(400).json('Error: ' + err));
//     } else if (req.headers.email) {
//         let userEmail = req.headers.email;
//         let googleUser = await GoogleUser.findOne({email: userEmail});
//         await Photo.findOneAndDelete({photoID: req.params.id, userID: googleUser._id})
//             .then(photos => res.json('Photo deleted!'))
//             .catch(err => res.status(400).json('Error: ' + err));
//     }
// });

// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})