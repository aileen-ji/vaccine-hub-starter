const bcrypt = require("bcrypt")

const pw = "supersecretpassword"

bcrypt.hash(pw, 6, (err, hashedPw))