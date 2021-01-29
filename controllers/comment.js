const Comment = require('../models/comment');
const Shelter = require('../models/shelter');

module.exports.newComment=async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    
    if(!shelter){
        req.flash('error', 'Shelter Database Cannot Find!')
        redirect('/shelter/:id');
    }
    //console.log(shelter);
    const comment = new Comment(req.body.comment).populate('author');
    comment.author = req.user._id;
    shelter.shelterComment.push(comment);
    await comment.save();
    await shelter.save();
    console.log(comment);
    console.log(shelter);
    req.flash('success', 'Comment Successfully Created!');
    res.redirect(`/shelter/${shelter._id}`);
};

module.exports.deleteComment=async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)||comment.author===null) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/shelter/${shelter._id}`)
    }
    await Shelter.findByIdAndUpdate(id, { $pull: { shelterComment: commentId } });
    await Comment.findByIdAndDelete(commentId);
    const shelter=await Shelter.findById(id);

    if(!shelter){
        req.flash('error', 'Shelter Database Cannot Find!')
        return redirect('/shelter/:id');
    }

    console.log(shelter);
    req.flash('success', 'Comment Successfully Deleted!');
    res.redirect(`/shelter/${id}`);
};