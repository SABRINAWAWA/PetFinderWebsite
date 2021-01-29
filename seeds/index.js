const mongoose = require('mongoose');
const cities = require('./cities');
const { firstName, lastName } = require('./seedHelpers');
const Pet = require('../models/pet');

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

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const sample = array => array[Math.floor(Math.random() * array.length)];
const gender = ['female', 'male'];
const size = ['small', 'medium', 'large'];
const typeOfPets=['dog', 'cat', 'other'];
const seedDB = async () => {
    await Pet.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random20 = Math.floor(Math.random() * 20);
        const ranDate = randomDate(new Date(2019, 11, 1), new Date());
        const newPet = new Pet({
            lostDate: `${ranDate.getMonth()+1}/${ranDate.getDate()}/${ranDate.getFullYear()}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dtabf2eam/image/upload/v1611633825/petfinder/hzw5ovsaueqfwzmrbcrx.jpg',
                  filename: 'petfinder/hzw5ovsaueqfwzmrbcrx'
                }          
              ],
            petname: `${sample(firstName)} ${sample(lastName)}`,
            age: random20,
            gender: `${sample(gender)}`,
            size: `${sample(size)}`,
            city: 'Dallas', //`${cities[random1000].city}`,
            state: 'Texas',//`${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            typeOfPet:`${sample(typeOfPets)}`,
            geometry: { type: 'Point', coordinates: [ -96.7969, 32.7763 ] },
            owner: '600f9b801a77b95fa0c9e678'
        });
        newPet.location= `${newPet.city} ${newPet.state}`;
        await newPet.save();
        console.log(newPet);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})