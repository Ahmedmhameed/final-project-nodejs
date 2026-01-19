const { dbConnection } = require("../config");
const { likeValidator } = require("../validators");

class Like {
  constructor(likeData) {
    this.likeData = likeData;
  }
  static likeDbConnection(cb) {
    dbConnection("likes", cb);
  }

  save(cb) {
    Like.likeDbConnection(async (collection) => {
      try {
        await collection.insertOne(this.likeData).then((result) => {
          cb({ status: true, _like_id: result.insertedId });
        });
      } catch (err) {
        cb({ status: false, message: err.message });
      }
    });
  }
  remove(cb) {
    Like.likeDbConnection(async (collection) => {
      try {
        await collection.deleteOne({ _id: this.likeData._id });
        cb({ status: true });
      } catch (err) {
        cb({ status: false, message: err.message });
      }
    });
  }

  static validate(likeData) {
    try {
      const validateResult = likeValidator.validate(likeData);
      return validateResult;
    } catch (err) {
      return { error: err };
    }
  }
  isExist() {
    return new Promise((resolv, reject) => {
      Like.likeDbConnection(async (collection) => {
        try {
          const like = await collection.findOne({
            _user_id: this.likeData._user_id,
            _article_id: this.likeData._article_id,
          });
          if (like)
            resolv({
              check: true,
              message: "Like already Exist",
            });
          else resolv({ check: false });
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = Like;
