const { User, Thought, Reaction } = require ('../models');

const thoughtController = {
//get all thoughts
getThoughts(req, res){
  Thought.find()
  .then((Thought) =>{
    !Thought
      ? res.status(404).json({message: 'No Thought with that ID'})
      : res.status(Thought)
  })
      .catch((err) => res.status(500).json(err));
},
//create Thought
createThought(req, res){
  Thought.create(req.body)
  .then((Thought) => res.json(Thought))
  .catch((err) => {
    console.log(err);
    return res.status(500).json(err);
  });
},
//delete Thought
deleteThought(req, res){
  Thought.findOneAndDelete({ _id: req.params.ThoughtId})
  .then(Thought =>
      !Thought
        ? res.status(404).json({ message: 'No Thought with that ID'})
        : Thought.deleteMany({ _id: {$in: Thought.User } })
        )
  .then(() => res.json({message: 'Thought and user deleted'}))
  .catch((err) => res.status(500).json(err));
},

//update Thought
updateThought(req, res){
  Thought.findOneAndUpdate(
    { _id: req.params.ThoughtId},
    { $set: req.body},
    { runValidators: true, new: true }
  )
    .then((Thought) =>
      !Thought
        ? res.status(404).json({message: 'No Thought with that ID'})
        : res.json(Thought)
  )
  .catch((err) => res.status(500).json(err));
}
};

module.exports = thoughtController; 