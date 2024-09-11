const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const URL = require("./models/url");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const { connectMongoDB } = require("./connection");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const port = 8001;
connectMongoDB("mongodb://localhost:27017/urlShortener").then(() =>
    console.log("MongoDB Connected!")
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/", checkAuth, staticRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);

app.get("/url/:shortID", async (req, res) => {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate(
        {
            shortID,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    res.redirect(entry.redirectURL);
});

app.listen(port, () => console.log("Server starter at Port:", port));
