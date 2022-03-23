const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./app/routes/auth");
const userRoute = require("./app/routes/users");
const postRoute = require("./app/routes/posts");
const categoryRoute = require("./app/routes/categories");

dotenv.config();
app.use(express.json());
 
mongoose
.connect('mongodb+srv://sindile:ukhNTEZenouQ3LZf@blog.e44wg.mongodb.net/Blog?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
})
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);




app.listen("5000", () =>{
    console.log("Backend is running")
});
