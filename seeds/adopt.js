const mongoose = require('mongoose');
const cities = require('./cities');
const { dogbreed, catbreed, shelterNames } = require('./breeds');
const { firstName, lastName } = require('./seedHelpers');
const PetAdoption = require('../models/petAdoption');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const gender = ['female', 'male'];
const size = ['small', 'medium', 'large'];

const seedDB = async () => {
    await PetAdoption.deleteMany({});
    for (let i = 0; i < 3; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random20 = Math.floor(Math.random() * 20);
        const newPetAdopt = new PetAdoption({
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=312&q=80',
            petname: `${sample(firstName)} ${sample(lastName)}`,
            age: random20,
            gender: `${sample(gender)}`,
            size: `${sample(size)}`,
            city: `${cities[random1000].city}`,
            state: `${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            typeOfPet: 'dog',
            isAdoptable: true,
            needsSpecialCare:false,
            dogBreeds: `${sample(dogbreed)}`,
            owner: '600bbd3ef525e75b18153a95'
        });
        await newPetAdopt.save();
        console.log(newPetAdopt);
    }

    for (let i = 0; i < 3; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random20 = Math.floor(Math.random() * 20);
        const newPetAdopt = new PetAdoption({
            image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80',
            petname: `${sample(firstName)} ${sample(lastName)}`,
            age: random20,
            gender: `${sample(gender)}`,
            size: `${sample(size)}`,
            city: `${cities[random1000].city}`,
            state: `${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            typeOfPet: 'cat',
            isAdoptable: true,
            needsSpecialCare:false,
            catBreeds: `${sample(catbreed)}`,
            owner: '600bbd3ef525e75b18153a95'

        });
        await newPetAdopt.save();
        console.log(newPetAdopt);
    }

    for (let i = 0; i < 3; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random20 = Math.floor(Math.random() * 20);
        const newPetAdopt = new PetAdoption({
            image: 'https://images.unsplash.com/photo-1512819432727-dbcb57a06f13?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            petname: `${sample(firstName)} ${sample(lastName)}`,
            age: random20,
            gender: `${sample(gender)}`,
            size: `${sample(size)}`,
            city: `${cities[random1000].city}`,
            state: `${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            typeOfPet: 'others',
            isAdoptable: true,
            needsSpecialCare:false,
            owner: '600bbd3ef525e75b18153a95'
        });
        await newPetAdopt.save();
        console.log(newPetAdopt);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})