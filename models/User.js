const { dbConnection } = require("../config/");
const { userValidator, loginValidator } = require("../validators");
const { hashSync, compareSync } = require("bcryptjs");

class User {
  constructor(userData) {
    this.userData = userData;
  }
  static userDbConnection(cb) {
    dbConnection("users", cb);
  }

  save(cb) {
    User.userDbConnection(async (collection) => {
      try {
        const hashedPassword = hashSync(this.userData.password);
        this.userData.password = hashedPassword;
        await collection.insertOne(this.userData).then((result) => {
          cb({ status: true, _user_id: result.insertedId });
        });
      } catch (err) {
        cb({ status: false, message: err.message });
      }
    });
  }
  static validate(userData) {
    try {
      const validateResult = userValidator.validate(userData);
      return validateResult;
    } catch (error) {
      return { error: err };
    }
  }
  static loginValidate(loginData) {
    try {
      const validateResult = loginValidator.validate(loginData);
      return validateResult;
    } catch (err) {
      return { error: err };
    }
  }

  isExist() {
    return new Promise((resolv, reject) => {
      User.userDbConnection(async (collection) => {
        try {
          const user = await collection.findOne({
            $or: [
              { username: this.userData.username },
              { email: this.userData.email },
            ],
          });
          if (user) {
            if (user.email === this.userData.email) {
              resolv({ check: true, message: "Email already Exist" });
            } else {
              reject({ check: true, message: "Username already Exist" });
            }
          } else resolv({ check: false });
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  static login(loginData) {
    return new Promise((resolve, reject) => {
      const validateResult = User.loginValidate(loginData);
      if (validateResult.error) {
        resolve({
          status: false,
          message: validateResult.error.message,
          code: 400,
        });
        return;
      }

      User.userDbConnection(async (collection) => {
        try {
          const user = await collection.findOne({
            username: loginData.username,
          });

          if (!user || !compareSync(loginData.password, user.password)) {
            resolve({ status: false, massage: "Login Faild" });
            return;
          }
          resolve({ status: true, data: user });
          return;
        } catch (error) {
          reject({ status: false, message: error.message, code: 500 });
        }
      });
    });
  }
}
module.exports = User;
