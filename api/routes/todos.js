const express = require("express");
const {
  CreateTodo,
  getAllTodos,
  getOneTodo,
  updateTodo,
  deleteTodo,
  getAllUsersTodos,
  getAnyOneTodo,
  createTodoForUser,
  updateTodoForUser,
  deleteTodoForUser,
} = require("../controllers/todoController");

const requireAuth = require("../middleware/requireAuth");
const { authRole } = require("../middleware/authRole");
const router = express.Router();

// require auth for all todos routes
router.use(requireAuth);

// GET all todos for the current user
router.get("/basic", getAllTodos);

//GET one todo for the current user
router.get("/basic/:id", getOneTodo);

//POST one todo for the current user
router.post("/basic", CreateTodo);

//UPDATE one todo for the current user
router.patch("/basic/:id", updateTodo);

//DELETE one todo for the current user
router.delete("/basic/:id", deleteTodo);


//Admin routes
router.use(authRole("admin"));
//GET all todos for all users (admin route)
router.get("/admin", getAllUsersTodos);

//GET one todo for all users (admin route)
router.get("/admin/:id", getAnyOneTodo);

// Create a todo for a specific user using user id (admin route)
router.post("/admin/:id",  createTodoForUser);

// Update a todo for a specific user using todo id (admin route)
router.patch("/admin/:id", updateTodoForUser);

// Delete a todo for a specific user using todo id (admin route)
router.delete("/admin/:id",  deleteTodoForUser);

module.exports = router;
