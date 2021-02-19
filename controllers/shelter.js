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

// shelter ==> Set up Index page to 'index.ejs', it will display all shelters.
module.exports.index = async (req, res) => {
    const shelters = await Shelter.find({});
    res.render('shelter/index', { shelters, state: 'All' });
};

// shelter ==> Set up New page to 'new.ejs', it will add a new pet item to Shelter DB.
module.exports.renderNewForm = (req, res) => {
    res.render('shelter/new');
};

module.exports.createNewForm = async (req, res) => {
    const shelter = new Shelter(req.body.shelter);
    shelter.owner = req.user._id;
    shelter.shelterImage = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const user = await User.findById(req.user._id);
    user.shelter = shelter;

    await user.save();
    await shelter.save();

    console.log(shelter);
    console.log(user);
    req.flash('success', 'Shelter Successfully Created!');
    res.redirect(`/shelter/${shelter._id}`);
};

// shelter ==> Show Page Request
module.exports.showFrom = async (req, res,) => {
    const shelter = await Shelter.findById(req.params.id).populate({ path: 'shelterComment', populate: { path: 'author' } }).populate('adoptablePet').populate('owner');

    if (!shelter) {
        req.flash('error', 'Shelter Cannot Find!')
        return redirect(`/shelter`);
    }

    res.render('shelter/show', { shelter });
};

// shelter ==> Edit Page Request
module.exports.renderEditForm = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id)
    if (!shelter) {
        req.flash('error', 'Shelter Cannot Find!')
        return res.redirect(`/shelter`);
    }
    if (!shelter.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/shelter/${shelter._id}`)
    }

    res.render('shelter/edit', { shelter });
};

// shelter ==> Update Page Request
module.exports.updateForm = async (req, res) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id);
    if (!shelter.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/shelter/${shelter._id}`)
    } else {
        const updatedShelter = await Shelter.findByIdAndUpdate(id, { ...req.body.shelter });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        updatedShelter.shelterImage.push(...imgs);
        await updatedShelter.save();

        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await updatedShelter.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
        }

        console.log(updatedShelter);
        req.flash('success', 'Shelter Successfully Updated!');
        return res.redirect(`/shelter/${shelter._id}`);
    }
};

// shelter ==> Delete Page Request
module.exports.deleteForm = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { $pull: { shelter: id } });
    const deletedShelter = await Shelter.findByIdAndDelete(id);

    if (!deletedShelter) {
        req.flash('error', 'Shelter Cannot Find!')
        return redirect('/shelter');
    }

    req.flash('success', 'Shelter Successfully Deleted!');
    res.redirect('/shelter');
};

// shelter & petAdoption ==> Set up New Page for new pet for shelter
module.exports.renderPetNewForm = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
        req.flash('error', 'Shelter Database Cannot Find!')
        return redirect(`/shelter/${shelter._id}/petAdoption`);
    }

    res.render('petAdoption/shelterNew', { dogbreeds, catbreeds, typeOfPet, sizes, genders, states, shelter });
};

module.exports.createPetForm = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
        req.flash('error', 'Shelter Database Cannot Find!')
        return redirect('/');
    }

    const petadopt = new PetAdoption(req.body.petadopt);
    const user = await User.findById(req.user._id);

    petadopt.shelterName = shelter._id;
    petadopt.owner = req.user._id;
    petadopt.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    shelter.adoptablePet.push(petadopt);
    user.petadoption.push(petadopt);

    await shelter.save();
    await petadopt.save();
    await user.save();

    console.log(petadopt);
    console.log(shelter);
    console.log(user);

    req.flash('success', 'Pet Successfully Created!');
    res.redirect(`/shelter/${shelter._id}/petAdoption`);
};

// shelter & petAdoption ==> Set up Index Page for new pet for shelter
module.exports.showPetFrom = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id).populate('adoptablePet');

    if (!shelter) {
        req.flash('error', 'Shelter Database Cannot Find!')
        return redirect('/');
    }

    res.render('shelter/petAdoptionindex', { shelter });
};

// shelter & petAdoption ==> Delete one adoptablePet item from shelter
module.exports.deletePetForm = async (req, res) => {
    const { id, petId } = req.params;
    console.log(req.user._id)
    const shelter = await Shelter.findById(id);
    const user = await User.findById(req.user._id);

    console.log(shelter);
    console.log(user);

    await User.findByIdAndUpdate(req.user._id, { $pull: { petadoption: petId } });
    await Shelter.findByIdAndUpdate(id, { $pull: { adoptablePet: petId } });
    await PetAdoption.findByIdAndDelete(petId);

    console.log(shelter);
    console.log(user);
    req.flash('success', 'Pet Successfully Deleted!');
    res.redirect(`/shelter/${id}/petAdoption`);
};