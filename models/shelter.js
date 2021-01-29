const mongoose = require('mongoose');
const Comment=require('./comment.js');
const petAdoption = require('./petAdoption.js');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const ShelterSchema = new Schema({
    shelterName: { type: String, required: true }, 
    shelterLocation: { type: String, required: true },
    shelterEmail: { type: String, required: true },
    shelterPhone: { type: String, required: true },
    shelterImage: [ImageSchema],
    shelterDescription: { type: String, required: true },
    shelterComment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    adoptablePet: [{ type: Schema.Types.ObjectId, ref: 'PetAdoption' }],
    owner:{type:Schema.Types.ObjectId,ref:'User'},
});

ShelterSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.shelterComment
            }
        })
    }
})

ShelterSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await petAdoption.deleteMany({
            _id: {
                $in: doc.adoptablePet
            }
        })
    }
})

module.exports = mongoose.model("Shelter", ShelterSchema);

