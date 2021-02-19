const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const PetAdoptionSchema = new Schema({
    petname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['female', 'male'],
        required: true
    },
    size: {
        type: String,
        lowercase: true,
        enum: ['small', 'medium', 'large'],
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
            'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
            'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
            'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: [ImageSchema],
    typeOfPet: {
        type: String,
        enum: ['dog', 'cat', 'others'],
        required: true
    },
    isAdoptable: {
        type: Boolean,
        required: true
    },
    needsSpecialCare: {
        type: Boolean,
        required: true
    },
    shelterName: {
        type: Schema.Types.ObjectId,
        ref: 'Shelter'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customer: [{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }],
    dogBreeds: {
        type: String,
        enum: ['Not Dog', 'Affenpinscher',
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
            'Mix']
    },
    catBreeds: {
        type: String,
        enum: ['Not Cat', 'Abyssinian',
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
            'Turkish Van']
    }
});

module.exports = mongoose.model('PetAdoption', PetAdoptionSchema);