const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const PetSchema = new Schema({
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
    lostDate: {
        type: String,
        required: true
    },
    typeOfPet: {
        type: String,
        enum: ['dog', 'cat', 'other'],
        required: true
    },
    image:[ImageSchema],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    location:{type: String},
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
});

module.exports = mongoose.model('Pet', PetSchema);