const { shelterSchema, commentSchema, petAdoptionSchema, petfinderSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

const Shelter = require('./models/shelter');
const PetAdoption = require('./models/petAdoption');
const Comment=require('./models/comment');
const User=require('./models/user');
const Pet = require('./models/pet');

// Validation Methods
module.exports.validatePet = (req, res, next) => {
    const { error } = petfinderSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


module.exports.validatePetAdoption = (req, res, next) => {
    const { error } = petAdoptionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateShelter = (req, res, next) => {
    const { error } = shelterSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id);
    if (!shelter.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/shelter/${shelter._id}`)
    }
    next();
};

module.exports.isPetOwner = async (req, res, next) => {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/petfinder`)
    }
    next();
};

module.exports.isAdoptPetAuthor = async (req, res, next) => {
    const { id } = req.params;
    const petadopt = await PetAdoption.findById(id);
    if (!petadopt.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/petAdoption');
    }
    next();
};