module.exports = app => {
    const bcrypt = require("bcrypt");
let password = "password123!";
let hashPW = "";

bcrypt.hash(password,10,function(err,hash) {
    hashPW = hash;
});
app.get("/hash", (req, res) => res.json({password: password, hashedPW: hashPW}));
};