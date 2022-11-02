//require dependencies
const { Schema, model, Types } = require("mongoose");
const moment = require('moment');
const { get } = require("request");


//reaction schema
const ReactionSchema = new Schema ({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },

    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },

    username: {
        type: String,
        required: true
    },

    createdAt:{
        type: Date,
        //default value is set to the current timestamp
        default: Date.now,
        //Getter to format the timestamp
        get: createdAtInfo => moment(createdAtInfo).format('MMM DD, YYYY [at] hh:mm a')
    }
},
    { 
        toJSON: {
            virtuals:true,
            getters:true
        },
        id: false
    }
);

//user schema
const UserSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
  
      email: {
        type: String,
        required: true,
        unique: true,
        //matching validation for email using regex
        match: [/.+@.+\..+/],
      },
      //Array of _id values referencing the Thought model
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Thought",
        },
      ],
      //Array of _id values referencing the User model (self-reference)
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    }
  );

//thought schema
const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
      type: Date,
      //default value is set to the current timestamp
      default: Date.now,
      //Getter to format the timestamp
      get: (createdAtInfo) =>
        moment(createdAtInfo).format("MMM DD, YYYY [at] hh:mm a"),
    },

    username: {
      type: String,
      required: true,
    },
    //array of nested documents with the reactionSchema
    reactions: [ReactionSchema],
  },

  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//virtual that retrieves the length of the thought's reactions array field
ThoughtSchema.virtual('reactionCount').get(function (){
    return this.reactions.length
})

//creating the thought model based on the thought schema
const Thought = model('Thought', ThoughtSchema)

//virtual that retrieves the length of the user's friends array
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length   
})

//create the user model based on the schema
const User = model('User', UserSchema)

