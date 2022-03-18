const { User, Thought, Reaction } = require('../models');

const thoughtController = {

    // GET /api/thoughts
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

    // GET /api/thoughts/:id
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

    // POST /api/thoughts
  
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

    // PUT /api/thoughts/:id
    
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


    // DELETE /api/thoughts/:id
    deleteThought({ params }, res) {
        // delete the thought
        Thought.findOneAndDelete({ _id: params.id })
        .then(ThoughtData => {
            if (!ThoughtData) {
                res.status(404).json({ message: 'No thought found with this id'});
                return;
            }
            // delete the reference to deleted thought in user's thought array
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

    // POST /api/thoughts/:id/reactions
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

    // DELETE /api/thoughts/:id/reactions
    
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