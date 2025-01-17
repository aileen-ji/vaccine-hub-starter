const { BadRequestError, UnauthorizedError} = require("../utils/errors")
const db = require("../db")
const { BCRYPT_WORK_FACTOR } = require('../config')
const bcrypt = require("bcrypt")

class User {
    static async makePublicUser(user){
        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            location: user.location,
            date: user.date
        }
    }

    static async login(credentials){
        // user submit email, password
        // if any fields missing, throw error
        const requiredFields = ["email", "password"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        //lookup user in db by email
        const user = await User.fetchUserByEmail(credentials.email)
        //if found, compare submitted password with db password
        //if there is match, return user
        if(user) {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if(isValid){
                return User.makePublicUser(user)
            }
        }
        //if any goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials){
        // user submit email and password, first and last name, location
        // if any fields missing, throw error
        const requiredFields = ["email", "password", "firstName", "lastName", "location"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid email.")
        }
        // make sure no user exists in system with that email already
        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }
        //take user password and hash it
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
        //take email and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase()
        //create new user in db with their info
        const result = await db.query(`INSERT INTO users (
            email,
            password,
            first_name,
            last_name,
            location
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, first_name, last_name, location, date;
        `, [lowercasedEmail, hashedPassword, credentials.firstName, credentials.lastName, credentials.location])
        //return the user
        const user = result.rows[0]

        return User.makePublicUser(user)
    }

    static async fetchUserByEmail(email) {
        if(!email) {
            throw new BadRequestError("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]

        return user
    }
}

module.exports = User