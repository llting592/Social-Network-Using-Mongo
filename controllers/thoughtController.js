const { User, Thought, Reaction } = require('../models');

const thoughtController = {

    // GET all thoughts
    getThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(ThoughtData => res.json(ThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // GET thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({message: 'No thought found with this id'});
                return;
            }
            res.json(ThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Create thought
  
    createThought({ body }, res) {
        Thought.create(body)
        .then(ThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: ThoughtData._id } },
                { new: true }
            )
            .then(UserData => {
                if (!UserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(UserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    //update thought
    
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(ThoughtData);
        })
        .catch(err => res.status(400).json(err));
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