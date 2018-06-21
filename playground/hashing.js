const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log('hash: ' +hash+ ' salt:' +salt);
    })
});

var hashedPassword = '$2a$12$kGhcP27iKSXW9jjWvcGAgeywdrQGmxUgmx7gVsWWx0J/p3r9xpat2';

bcrypt.compare('123!', hashedPassword, (err, res) => {
    console.log(res);
});
// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log('Token: ', token);

// var decoded = jwt.verify(token, '123abc');
// console.log('Decoded: ', decoded);


// var message = 'I am user No.3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'saltbaestrikes').toString()
// }

// token.data = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'saltbaestrikes').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust');
// };