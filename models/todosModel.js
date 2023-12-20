const mongoose = require('mongoose');

const Schema = mongoose.Schema

const todoSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    date:{
        type: String,
        
        required: true
    },
    description: {
        type: String,
        default:"No Description"

    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    user_id: {
      type: String,
      required: true
    },
    username:{
        type:String,
        required:true
    }
}, {timestamps: true});

module.exports = mongoose.model('Todo', todoSchema);

