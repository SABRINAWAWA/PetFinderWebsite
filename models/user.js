const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    UniEmail: { type: String, required: true, unique: true },
    userCity: { type: String, required: true },
    userState: { type: String, required: true },
    userZIP: { type: String, required: true },
    lostPet: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
    shelter: { type: Schema.Types.ObjectId, ref: 'Shelter' },
    petadoption: [{ type: Schema.Types.ObjectId, ref: 'PetAdoption' }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);






