const Pet = require('../models/pet');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Required Information
const sizes = ['small', 'medium', 'large'];
const genders = ['female', 'male'];
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
const typeOfPet = ['dog', 'cat', 'other'];

// petfinder ==> Set up Index page to 'index.ejs', it will display all lost pets
module.exports.renderIndex = async (req, res) => {
    const {state}=req.query;
    const {typeOfPet}=req.query;
    if(state){
        const pets=await Pet.find({state}).populate('owner');
        res.render('petfinder/index',{pets, typeOfPet:'Pets',state});
    }else if(typeOfPet){
        const pets=await Pet.find({typeOfPet}).populate('owner');
        res.render('petfinder/index',{pets, typeOfPet, state:"in all states"});
    }else{
        const pets = await Pet.find({}).populate('owner');
        res.render('petfinder/index', { pets, typeOfPet:'Pets', state:"in all states" });
    }
};

// petfinder ==> Set up New page to 'new.ejs', it will add a new pet item to Pet DB.
module.exports.renderNewForm = async (req, res) => {
    res.render('petfinder/new', { sizes, genders, states, typeOfPet });
};

// petfinder ==> Show Page Request
module.exports.createNewForm = async (req, res) => {
    const pet = new Pet(req.body.pet);
    if (!pet) {
        req.flash('error', 'Lost Pet Cannot Find!')
        return redirect(`/petfinder`);
    }
    pet.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash('error', 'User Cannot Find!')
        return redirect(`/`);
    }
    pet.owner = (req.user._id);
    user.lostPet.push(pet._id);
    pet.location = `${pet.city} ${pet.state}`;
    await pet.save();
    await user.save();
    console.log(pet);
    console.log(user);

    const geoData = await geocoder.forwardGeocode({
        query: pet.location,
        limit: 1
    }).send();
    pet.geometry = geoData.body.features[0].geometry;
    await pet.save();
    console.log(pet);

    req.flash('success', 'Lost Pet Post Successfully Created!');
    res.redirect(`/petfinder/${pet._id}`);
};

// petfinder ==> Show Page Request
module.exports.showPet = async (req, res,) => {
    const pet = await Pet.findById(req.params.id).populate('owner');

    if (!pet) {
        req.flash('error', 'Lost Pet Cannot Find!')
        return redirect(`/petfinder`);
    }

    res.render('petfinder/show', { pet });
};

// petfinder ==> Edit Page Request
module.exports.editPetForm = async (req, res) => {
    const pet = await Pet.findById(req.params.id)

    if (!pet) {
        req.flash('error', 'Lost Pet Cannot Find!')
        return redirect(`/petfinder/:id`);
    }

    res.render('petfinder/edit', { pet, sizes, genders, states, typeOfPet });
};

// petfinder ==> Update Page Request
module.exports.updatePetForm = async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, { ...req.body.pet });
    if (!pet) {
        req.flash('error', 'Lost Pet Cannot Find!')
        return redirect(`/petfinder/:id`);
    }
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    pet.image.push(...imgs);
    await pet.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await pet.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    console.log(pet);
    req.flash('success', 'Lost Pet Post Successfully Updated!');
    res.redirect(`/petfinder/${pet._id}`)
};

// petfinder ==> Delete Page Request
module.exports.deletePetForm = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { lostPet: id } });
    const deletedPet = await Pet.findByIdAndDelete(id);
    if (!deletedPet) {
        req.flash('error', 'Lost Pet Cannot Find!')
        return redirect(`/petfinder/:id`);
    }
    await user.save();
    console.log(user);
    req.flash('success', 'Lost Pet Post Successfully Deleted!');
    res.redirect('/petfinder');
};