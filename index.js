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
app.set('port',process.env.PORT || 5000);
mongoose
.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
})
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Welcome to S-ARMY-BLOG. Where we love BTS!')
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);




app.listen(app.get("port"), () => {
    console.log('backend is running')
})
