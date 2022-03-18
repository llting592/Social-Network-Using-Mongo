const { Schema, model } = require('mongoose');

// Schema to create a course model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //email validation
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought',
        }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {toJson: {
    virtuals: true,
    getters: true,
  },
  id: false
  }
)
    
//get friendcount
userSchema.virtual('friendCount').get(function(){
  return this.friends.length;
}) 

const User = model('User', userSchema);

module.exports = User;