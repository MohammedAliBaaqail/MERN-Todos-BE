const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET)
}

// login a user
const loginUser = async (req, res) => {
  const {username, password} = req.body

  try {
    const user = await User.login(username, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({username, token, 'role' : user.role})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {username, password} = req.body

  try {
    const user = await User.signup(username, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

//---------------Admin-----------------
// get all users info
const getUsers = async (req, res) => {
  try{
    const users = await User.find().sort({ createdAt: -1 })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}

//Get one user info
const getUser = async (req, res) => {
  const {username} = req.param
  try{
    const user = await User.find({username}).sort({ createdAt: -1 })
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}

//Update user info
const updateUser = async (req, res) => {
  const { username } = req.body;
  try {
    // Assuming you're updating the user by username
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $set: req.body }, // Updating with the request body
      { new: true } // To return the updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { username } = req.body;
  try {
    
    const deletedUser = await User.findOneAndDelete({ username: username });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};