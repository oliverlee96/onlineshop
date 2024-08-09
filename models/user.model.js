const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
    constructor(email, password, fullname, street, city, postcode) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            city: city,
            postcode: postcode

        };
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12); //takes in the password and value of hash length
        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword, //to be looked at - HASH
            name: this.name,
            address: this.address
        });
    }
}

module.exports = User;