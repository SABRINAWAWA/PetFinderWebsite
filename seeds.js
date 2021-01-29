// Requiring express, mongoose, and method-override API.
const mongoose = require('mongoose');

// Requiring pet finder schema.
const Pet = require('./models/pet');

// Connecting to mongoose with database as petfinder.
mongoose.connect('mongodb://localhost:27017/petfinder', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// If successfully connected to database, console will print out "Datebase connected".
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedpet=[
    {
        petname: 'first-try',
        age: 4,
        gender: 'female',
        size: 'small',
        city: 'sf',
        state: 'ca',
        description: 'my first dog'
    },
    {
        petname: 'second-try',
        age: 4,
        gender: 'female',
        size: 'medium',
        city: 'sf',
        state: 'ca',
        description: 'my first dog'
    },
    {
        petname: 'third-try',
        age: 4,
        gender: 'male',
        size: 'small',
        city: 'sf',
        state: 'ca',
        description: 'my first dog'
    },
    {
        petname: 'fouth-try',
        age: 4,
        gender: 'male',
        size: 'large',
        city: 'sf',
        state: 'ca',
        description: 'my first dog'
    }];

Pet.insertMany(seedpet).then(res => { console.log(res) }).catch(e => { console.log(e) });