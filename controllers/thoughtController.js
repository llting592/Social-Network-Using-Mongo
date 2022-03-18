const res = require('express/lib/response');
const { User, Thought, Reaction } = require('../models');

const thoughtController = {

    // GET all thoughts
    getThoughts(req, res){
        Thought.find()
        .then((ThoughtData) => res.json(ThoughtData))
        .catch((err) => res.status(500).json(err));
    },

    // GET thought by ID
    getThoughtById({ params }, res) {
        //.id 
        Thought.findOne({ _id: params.id })
        .then((ThoughtData) =>
        !ThoughtData
            ?res.status(404).json({message: "No thought with that ID"})
            :res.json(ThoughtData)
            )
            .catch((err)=> res.status(500).json(err));
    }, 

    //Create thought
    createThought(req, res) {
        //.id 
        Thought.create(req.body)
        .then((ThoughtData) => res.json(ThoughtData))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //update thought
    
    updateThought(req, res){
        Thought.findOneAndUpdate(
            {_id: req.params.id},
            { $set: req.body},
            {runValidators: true, new: true}
        )
        .then((ThoughtData) =>
        !ThoughtData
            ? res.status(404).json({message: 'No thought with this ID'})
            : res.json(ThoughtData)
            )
            .catch((err) => res.status(500).json(err));
        },


    //Delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({ message: 'No thought found with this id'});
                return;
            }
            User.findOneAndUpdate(
                { username: ThoughtData.username },
                { $pull: { thoughts: params.id } }
            )
            .then(() => {
                res.json({message: 'Successfully deleted thought'});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },

    //Create reaction to thoughts
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(ThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    //Delete reaction
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json({message: 'Successfully deleted the reaction'});
        })
        .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtController;