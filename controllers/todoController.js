const Todo = require("../models/todosModel");
const mongoose = require("mongoose");

const checkValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// get all todos
const getAllTodos = async (req, res) => {
  const user_id = req.user._id;

  try {
    const todos = await Todo.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// get one todo
const getOneTodo = async (req, res) => {
  const { id } = req.params;
  if (!checkValidId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (String(todo.user_id) !== String(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// create new todo
const CreateTodo = async (req, res) => {
  const { title, date, description, username } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (title.length > 20) {
    
    return res
      .status(400)
      .json({ error: "Title must have less than 20 characters",emptyFields });
  }
  if (!username) {
    emptyFields.push("Username");
  }
  if (!date) {
    emptyFields.push("deadline");
  }

  if (emptyFields.length > 0) {

    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }
  
  // add doc to db
  try {
    const user_id = req.user._id;
    const todo = await Todo.create({
      title,
      date,
      description,
      username,
      user_id,
    });
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update todo
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, date } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  } else if (title.length > 20) {
    return res
      .status(400)
      .json({ error: "Title must contain less than 21 characters" });
      
  }


  if (!date) {
    emptyFields.push("deadline");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }
  
  try {
    let todo = await Todo.findOne({ _id: id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (String(todo.user_id) !== String(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const allowedFieldsToUpdate = {
      ...req.body,
    };

    // Update the allowed fields in the todo
    todo = await Todo.findOneAndUpdate(
      { _id: id },
      { $set: allowedFieldsToUpdate },
      { new: true }
    );

    return res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

// delete todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!checkValidId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (String(todo.user_id) !== String(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // If the todo belongs to the user, proceed to delete it
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(500).json({ error: "Failed to delete todo" });
    }

    return res.status(200).json(deletedTodo);
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

//------------------Admin------------------------

const getAllUsersTodos = async (req, res) => {

  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const getAnyOneTodo = async (req, res) => {
  const { id } = req.params;
  if (!checkValidId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const createTodoForUser = async (req, res) => {
  const { title, date, description, username, user_id } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!date) {
    emptyFields.push("date");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  // add doc to db
  try {
    const todo = await Todo.create({
      title,
      date,
      description,
      username,
      user_id,
    });
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTodoForUser = async (req, res) => {
  
  const { id } = req.params;

  if (!checkValidId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const todo = await Todo.findOne({ _id: id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Update only allowed fields in the todo
    const allowedFieldsToUpdate = {
      // Define the fields that are allowed to be updated here
      // For example: title, description, completed, etc.
      ...req.body,
    };

    // Update the allowed fields
    Object.assign(todo, allowedFieldsToUpdate);
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteTodoForUser = async (req, res) => {
  const { id } = req.params;

  if (!checkValidId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(500).json({ error: "Failed to delete todo" });
    }

    return res.status(200).json(deletedTodo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
module.exports = {
  getAllTodos,
  getOneTodo,
  CreateTodo,
  updateTodo,
  deleteTodo,
  getAllUsersTodos,
  getAnyOneTodo,
  createTodoForUser,
  updateTodoForUser,
  deleteTodoForUser,
};
