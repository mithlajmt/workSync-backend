const jwt = require('jsonwebtoken')
const decodeToken = async (pass,hashedpass){
    return jwt.verify(pass,hashedpass)
}