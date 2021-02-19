const PetAdoption = require('../models/petAdoption');
const Shelter = require('../models/shelter');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");

// Required Information
const sizes = ['small', 'medium', 'large'];
const genders = ['female', 'male'];
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
const typeOfPet = ['dog', 'cat', 'other'];
const catbreeds = ['Not Cat', 'Abyssinian',
    'Australian Mist',
    'Balinese',
    'Bengal',
    'Birman',
    'Bombay',
    'British Shorthair',
    'Burmese',
    'Burmilla',
    'Cornish Rex',
    'Devon Rex',
    'Egyptian Mau',
    'Exotic Shorthair',
    'Japanese Bobtail',
    'Korat',
    'La Perms',
    'Maine Coon',
    'Manx',
    'Norwegian Forest',
    'Ocicat',
    'Oriental Shorthair',
    'Persian Longhair',
    'Ragdoll',
    'Russian Blue',
    'Scottish Fold',
    'Siamese',
    'Siberian Forest',
    'Singapura',
    'Snowshoe',
    'Somali',
    'Sphynx',
    'Tiffanie',
    'Tonkinese',
    'Turkish Van'];
const dogbreeds = [
    'Not Dog', 'Affenpinscher',
    'Afghan Hound',
    'Airedale Terrier',
    'Alaskan Malamute',
    'American Staffordshire Bull Terrier',
    'Anatolian Shepherd Dog',
    'Australian Cattle Dog',
    'Australian Kelpie',
    'Australian Shepherd Dog',
    'Australian Silky Terrier',
    'Australian Terrier',
    'Basenji',
    'Basset Fauve de Bretagne',
    'Basset Hound',
    'Beagle',
    'Bearded Collie',
    'Bedlington Terrier',
    'Belgian Shepherd Dog',
    'Bernese Mountain Dog',
    'Bichon Frise',
    'Bloodhound',
    'Border Collie',
    'Border Terrier',
    'Borzoi',
    'Boston Terrier',
    'Bouvier des Flandres',
    'Boxer',
    'Bracco Italiano',
    'Briard',
    'Brittany',
    'Bull Terrier',
    'Bull Terrier Miniature',
    'Bulldog',
    'Bullmastiff',
    'Cairn Terrier',
    'Cavalier King Charles Spaniel',
    'Cesky Terrier',
    'Chesapeake Bay Retriever',
    'Chihuahua (Smooth Coat)',
    'Chinese Crested',
    'Chow Chow (Smooth)',
    'Clumber Spaniel',
    'Collie',
    'Curly-Coated Retriever',
    'Dachshund',
    'Dalmatian',
    'Dandie Dinmont Terrier',
    'Deerhound',
    'Dobermann',
    'Dogue de Bordeaux',
    'English Setter',
    'English Springer Spaniel',
    'English Toy Terrier (Black & Tan)',
    'Field Spaniel',
    'Finnish Lapphund',
    'Finnish Spitz',
    'Flat-Coated Retriever',
    'Others',
    'Mix'];
// petAdoption ==> Set up Index page to 'index.ejs', it will display all lost pets
module.exports.renderIndex = async (req, res) => {
    const {state}=req.query;
    const {typeOfPet}=req.query;
    if(state){
        const petadopts = await PetAdoption.find({state}).populate('shelterName');
        res.render('petAdoption/index',{petadopts, typeOfPet:'Pets',state});
    }else if(typeOfPet){
        const petadopts = await PetAdoption.find({typeOfPet}).populate('shelterName');
        res.render('petAdoption/index',{petadopts, typeOfPet, state:"in all states"});
    }else{
        const petadopts = await PetAdoption.find({}).populate('shelterName');
        res.render('petAdoption/index', { petadopts, typeOfPet:'Pets', state:"in all states" });
    }
};

// petAdoption ==> Set up New page to 'new.ejs', it will add a new pet item to PetAdoption DB.
module.exports.renderNewForm=async (req, res) => {
    res.render('petAdoption/new', { sizes, genders, states, typeOfPet, dogbreeds, catbreeds });
};

module.exports.createNewForm=async (req, res) => {
    const petadopt = new PetAdoption(req.body.petadopt);
    if (!petadopt) {
        req.flash('error', 'Adoptable Pet Cannot Find!')
        return redirect(`/petAdoption`);
    }
    
    petadopt.image = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash('error', 'User Cannot Find!')
        return redirect(`/`);
    }

    console.log(user);
    petadopt.owner = user;
    user.petadoption.push(petadopt);

    await petadopt.save();
    await user.save();

    console.log(petadopt);
    console.log(user);

    req.flash('success', 'Pet Successfully Created!');
    res.redirect(`/petAdoption/${petadopt._id}`);
};

// petAdoption ==> Show Page Request
module.exports.showForm=async (req, res,) => {
    const petadopt = await PetAdoption.findById(req.params.id).populate({ path: 'customer', populate: { path: 'author' } }).populate('shelterName').populate('owner');

    if (!petadopt) {
        req.flash('error', 'Adoptable Pet Cannot Find!')
        return redirect(`/petAdoption`);
    }

    if (petadopt.shelterName !== undefined) {
        const shelter = await Shelter.findById(petadopt.shelterName._id);
        res.render('petAdoption/show', { petadopt, shelter });
    }

    res.render('petAdoption/show', { petadopt });
};

// petAdoption ==> Edit Page Request
module.exports.renderEditForm=async (req, res) => {
    const petadopt = await PetAdoption.findById(req.params.id).populate('shelterName')

    if (!petadopt) {
        req.flash('error', 'Adoptable Pet Cannot Find!')
        return redirect(`/petAdoption`);
    }

    res.render('petAdoption/edit', { petadopt, sizes, genders, states, typeOfPet, dogbreeds, catbreeds });
};

// petAdoption ==> Update Page Request
module.exports.updatePetForm=async (req, res) => {
    const { id } = req.params;
    const petadopt = await PetAdoption.findByIdAndUpdate(id, { ...req.body.petadopt });

    if (!petadopt) {
        req.flash('error', 'Adoptable Pet Cannot Find!')
        return redirect(`/petAdoption`);
    }

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    petadopt.image.push(...imgs);
    await petadopt.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await petadopt.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    console.log(petadopt);
    req.flash('success', 'Pet Successfully Updated!');
    res.redirect(`/petAdoption/${petadopt._id}`)
};

// petAdoption ==> Delete Page Request
module.exports.deletePet=async (req, res) => {
    const { id } = req.params;
    const user=User.findById(req.user._id);
    await User.findByIdAndUpdate(req.user._id,{$pull:{petadoption: id}});
    const deletedPet = await PetAdoption.findByIdAndDelete(id);

    if (!deletedPet) {
        req.flash('error', 'Adoptable Pet Cannot Find!')
        return redirect(`/petAdoption`);
    }

    console.log(user);
    req.flash('success', 'Pet Successfully Deleted!');
    res.redirect('/petAdoption');
}