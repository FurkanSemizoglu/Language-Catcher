const bcrypt = require('bcryptjs');


const hashPassword = (password: string): Promise<string> => {
   return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err: Error | null, salt: string) => {
         if (err) {
            return reject(err);
         }
         bcrypt.hash(password, salt, (err: Error | null, hash: string) => {
            if (err) {
               return reject(err);
            }
            resolve(hash);
         });
      });
   });
};

const comparePassword = (password: string, hashed: string): Promise<boolean> => {
   return bcrypt.compare(password, hashed);
};

function isEmail(email : string)  : boolean{
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}

export { hashPassword, comparePassword , isEmail };