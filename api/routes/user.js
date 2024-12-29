const express = require('express')

// controller functions
const { loginUser, signupUser, getUsers, getUser,updateUser  } = require('../controllers/userController')
const requireAuth = require("../middleware/requireAuth");
const { authRole } = require("../middleware/authRole");

const router = express.Router()



// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)



//Admin routes
router.use(requireAuth);
router.use(authRole("admin"));
//Get all users
router.get('/admin/get', getUsers)

//Get one user
router.get('/admin/get/:id', getUser)

//Update user info
router.patch('/admin/update/:id', updateUser)


module.exports = router