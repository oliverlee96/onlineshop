function isEmpty(value) { //check if a field value is empty
    return !value || value.trim() === '';
}

function userCredentialsAreValid(email, password) { //check if email and pasword are valid
    return email && 
    email.includes('@') && 
    password && 
    password.trim().length > 5
}

function userDetailsAreValid(name, street, postal, city) { //check there are values for address
    return (
        !isEmpty(name) && 
        !isEmpty(street) &&
        !isEmpty(postal) &&
        !isEmpty(city)
    );
}

function emailsMatch(email, confirmEmail) {
    return email === confirmEmail;
}

module.exports =  {
    userDetailsAreValid: userDetailsAreValid,
    emailsMatch: emailsMatch
};