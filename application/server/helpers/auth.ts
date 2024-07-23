const bcrypt = require("bcryptjs");

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

const comparePassword = (
  password: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashed).catch((error: any) => {
    console.log(error);
    return false;
  });
};

function isEmail(email: string): boolean {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  let flag: boolean = false;

  const emailArrays: string[] = ["@gmail.com", "@hotmail.com", "@outlook.com"];
  if (
    (email !== "" && email.includes(emailArrays[0])) ||
    email.includes(emailArrays[1]) ||
    (email.includes(emailArrays[2]) && email.match(emailFormat))
  ) {
    return true;
  }

  return false;
}

const isPassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(password)) {
    return false;
  }
  return true;
};

export { hashPassword, comparePassword, isEmail  , isPassword};
