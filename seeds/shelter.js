const mongoose = require('mongoose');
const cities = require('./cities');
const { shelterNames } = require('./breeds');
const { firstName, lastName } = require('./seedHelpers');
const Shelter = require('../models/shelter');

mongoose.connect('mongodb://localhost:27017/petfinder', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Shelter.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const newShelter = new Shelter({
            owner:'600a4a55ed7880c9705d764b',
            shelterName: `${shelterNames[i]} Shelter`,
            shelterLocation: `${cities[random1000].city}, ${cities[random1000].state}`,
            shelterEmail: `${shelterNames[i]}@gmail.com`,
            shelterPhone: `123-456-7890`,
            shelterDescription: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            shelterImage: 'https://www.aspca.org/sites/default/files/blog_10-reasons-asdm_101619_body1.jpg',
        });
        await newShelter.save();
        console.log(newShelter);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})