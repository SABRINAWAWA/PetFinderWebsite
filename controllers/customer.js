const petAdoption = require('../models/petAdoption');
const Customer=require('../models/customer');
const Shelter=require('../models/shelter');

module.exports.newCustomer=async (req, res) => {
    const adoptPet = await petAdoption.findById(req.params.id);
    if(!adoptPet){
        req.flash('error', 'PetAdoption Database Cannot Find It!')
        return redirect('/petAdoption/:id');
    }
    const customer = new Customer(req.body.customer).populate('author');
    customer.author = req.user._id;
    adoptPet.customer.push(customer);

    await customer.save();
    await adoptPet.save();

    console.log(customer);
    console.log(adoptPet);
    req.flash('success', 'You are added into the contact list of this pet, you will receive an email from the shelter/pet owner later!');
    res.redirect(`/petAdoption/${adoptPet._id}`);
};

module.exports.deleteCustomer=async (req, res) => {
    const { id, customerId } = req.params;
    const customer = await Customer.findById(customerId);

    const adoptPet=await petAdoption.findByIdAndUpdate(id, { $pull: { customer: customerId } });
    await Customer.findByIdAndDelete(customerId);

    console.log(adoptPet);
    req.flash('success', 'This contact is deleted!');
    res.redirect(`/userprofile`);
};