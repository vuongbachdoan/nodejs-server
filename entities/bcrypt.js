const bcrypt = require('bcrypt');
require('dotenv').config()
const saltRounds = 10;



const bcryptHandle = {
    hashPassword : async (plaintextPassword) => {
        const hash = await bcrypt.hash(plaintextPassword, saltRounds);
        return hash.toString();
    },
    comparePassword : async (plaintextPassword, hash) => {
        const result = await bcrypt.compare(plaintextPassword, hash);
        return result;
    }
}

module.exports = bcryptHandle