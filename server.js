require('dotenv').config()
const express = require("express")
const cors = require('cors');
const todoRouts = require('./routes/todos')


const userRouts = require('./routes/user')

const mongoose = require('mongoose')

// express app
const app = express() 
app.use(cors());
//middle ware 
app.use(express.json())


app.use((req, res , next) => {
    console.log(req.path , req.method)
    next()
})

// routs 

app.use('/todos' ,  todoRouts)
app.use('/user' ,  userRouts)


//coneect to db 
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        // only listen to the port when the database connection is already done 
        app.listen(process.env.PORT , () => {
            console.log('connected to DB && listening on port 4000 !!')
        })
        

    })
    .catch((error) => {
        console.log(error)
    })

// listen for request 


process.env 