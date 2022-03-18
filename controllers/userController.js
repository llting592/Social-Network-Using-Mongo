const { User, Thought } = require('../models');

const userController = {

    //get all users
    getUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(UserData => res.json(UserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    //get user by ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate([
            { path: 'thoughts', select: "-__v" },
            { path: 'friends', select: "-__v" }
        ])
        .select('-__v')
        .then(UserData => {
            if (!UserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(UserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create user
    
    createUser({ body }, res) {
        User.create(body)
        .then(UserData => res.json(UserData))
        .catch(err => res.status(400).json(err));
    },

    //update user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(UserData => {
            if (!UserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(UserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // Delete users
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(UserData => {
            if (!UserData) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
        })
            .catch(err => res.status(400).json(err));
    },

    //Add friends
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(UserData => {
            if (!UserData) {
                res.status(404).json({ message: 'No user found with this ID' });
                return;
            }
            // add userId to friendId's friend list
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $push: { friends: params.id } },
                { new: true, runValidators: true }
            )
            .then(UserData2 => {
                if(!UserData2) {
                    res.status(404).json({ message: 'No user found with this friend ID' })
                    return;
                }
                res.json(UserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },

    // Delete friend
    deleteFriend({ params }, res) {
        
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(UserData => {
            if (UserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.id } },
                { new: true, runValidators: true }
            )
            .then(UserData2 => {
                if(!UserData2) {
                    res.status(404).json({ message: 'No user found with this friend Id' })
                    return;
                }
                res.json({message: 'Successfully deleted friend'});
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
}

module.exports = userController;