const { Schema, model, Types } = require('mongoose');
const reactionSchema = require('./Reaction');
const moment = require('moment')


// Schema to create a course model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      //must be between 1 and 280 characters
      minlength: 1,
      maxlength: 280
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      //getter
      get: (createdAtVal) => moment(createdAtVal).format('MMM Do, YYY [at] hh:mm a')
    },
    reactions: [reactionSchema]
    },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false,
  }
);
//get reactioncount
thoughtSchema.virtual('reactionCount').get(function(){
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
