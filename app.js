const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
    res.json({
        message: "Nodejs JWT auth"
    });
});

app.post("/api/login", (req, res) => {

    const user = {
        id: 1,
        name: "John Doe",
        email: "johndoe@email.com"
    }

    jwt.sign({user}, 'secretkey', {expiresIn: '25s'}, (err, token) => {
        res.json({
            token
        });
    });
});

app.post("/api/posts", checkToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "post created",
                authData
            });
        }
    });
});

// Authorization: Bearer <token>
function checkToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3000, function() {
    console.log("nodejs app running");
});