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

export { hashPassword, comparePassword };