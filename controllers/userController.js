const { User, Thought} = require('../models');

module.exports = {
    //get all Users
    getUsers(req, res) {
        User.find()
          .then (users => {
            // const userObj = {
            //   users
            // };
            return res.json(users);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },
      // Get a single user
      getUserById(req, res) {
        User.findOne({ _id: req.params.id })
          .select('-__v')
          .then((User) =>
            !User
              ? res.status(404).json({ message: 'No User with that ID' })
              : res.json(
                  User
                )
          )
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },
      // create a new user
      createUser(req, res) {
        User.create(req.body)
          .then((User) => res.json(User))
          .catch((err) => res.status(500).json(err));
      },
      // Delete a user
      deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
          .then((user) => {
        //     !User
        //       ? res.status(404).json({ message: 'No such user exists' })
        //       : Thought.findOneAndUpdate(
        //           { User: req.params.UserId },
        //           { $pull: { User: req.params.UserId } },
        //           { new: true }
        //         )
        //   )
        //   .then((Thought) =>
        //     !Thought
        //       ? res.status(404).json({
        //           message: 'User deleted, but no Thought found',
        //         })
        //       : res.json({ message: 'Student successfully deleted' })
        if(!user){
            res.status(404).json({message: 'User not found'})
        }
        res.status(200).json(user)
    })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      //update Users
      updateUser({params, body}, res){
          User.findOneAndUpdate({ 
              _id: params.id
          },
          { $set: body }, 
          {runValidators: true, }
          )
          .then(userUpdate => {
              console.log('in update user');
              console.log(userUpdate);
            !userUpdate 
                ? res.status(404).json({
                    message: 'User not found',
                })
                : res.status(200).json(userUpdate)
          })
          .catch(err => {
              console.log(err);
              res.status(500).json(err);
          });
          
      }

    
      // Add an assignment to a student
    //   addAssignment(req, res) {
    //     console.log('You are adding an assignment');
    //     console.log(req.body);
    //     Student.findOneAndUpdate(
    //       { _id: req.params.studentId },
    //       { $addToSet: { assignments: req.body } },
    //       { runValidators: true, new: true }
    //     )
    //       .then((student) =>
    //         !student
    //           ? res
    //               .status(404)
    //               .json({ message: 'No User found with that ID :(' })
    //           : res.json(student)
    //       )
    //       .catch((err) => res.status(500).json(err));
    //   },
    //   // Remove assignment from a student
    //   removeAssignment(req, res) {
    //     Student.findOneAndUpdate(
    //       { _id: req.params.studentId },
    //       { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
    //       { runValidators: true, new: true }
    //     )
    //       .then((student) =>
    //         !student
    //           ? res
    //               .status(404)
    //               .json({ message: 'No student found with that ID :(' })
    //           : res.json(student)
    //       )
    //       .catch((err) => res.status(500).json(err));
    //   },
    };
    