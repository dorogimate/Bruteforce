const bcrypt = require('bcrypt');

module.exports.hashingPassword = function (myPlaintextPassword, saltRounds) {
    return bcrypt.hash(myPlaintextPassword, saltRounds);
}


module.exports.checkPasswordForLogin = function (loginPasswordString, hashedPassword) {
    return bcrypt.compare(loginPasswordString, hashedPassword)
}
