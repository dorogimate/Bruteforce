const bcrypt = require('bcrypt');

module.exports.hashingPassword = function (myPlaintextPassword, saltRounds) {
    return bcrypt.hash(myPlaintextPassword, saltRounds);
}


module.exports.checkPasswordForLogin = async function (loginPasswordString, hashedPassword) {
    return await bcrypt.compare(loginPasswordString, hashedPassword)
}
