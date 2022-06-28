const {UnauthorizedError} = require("../utils/errors")

class User {
    static async login(credentials){
        // user submit email and password
        // if any fields missing, throw error
        //lookup user in db by email
        //if found, compare submitted password with db password
        //if there is match, return user
        //if any goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials){
        // user submit email and password
        // if any fields missing, throw error
        // make ssure no user exists in system with that email already
        //take user password and hash it
        //take email and lowercase it
        //create new user in db with their info
        //return the user
    }
}

module.exports = User