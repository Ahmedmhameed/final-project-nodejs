const { dbConnection } = require("../config");
const { articleValidator } = require("../validators");
const { ObjectId } = require("bson");

class Article {
  constructor(articaleData) {
    this.articaleData = articaleData;
  }
  static articaleDbConnection(cb) {
    dbConnection("articles", cb);
  }

  static saveAll(articles) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(articles) || articles.length === 0) {
        return resolve({ status: false, message: "No articles to insert" });
      }
      Article.articaleDbConnection(async (collection) => {
        try {
          await collection.insertMany(articles, { ordered: false });
          resolve({ status: true });
        } catch (err) {
          reject({ status: false, message: err.message });
        }
      });
    });
  }
  static getAllArticles(page, limit) {
    return new Promise((resolve, reject) => {
      Article.articaleDbConnection(async (collection) => {
        try {
          let articles;
          if (page && limit) {
            const skip = (page - 1) * limit;
            articles = await collection
              .find({})
              .skip(skip)
              .limit(limit)
              .toArray();
          } else {
            articles = await collection.find({}).toArray();
          }
          resolve({ status: true, data: articles, page, limit });
        } catch (err) {
          reject({ status: false, message: err.message });
        }
      });
    });
  }
  static getArticle(_article_id) {
    return new Promise((resolve, reject) => {
      Article.articaleDbConnection(async (collection) => {
        try {
          const _id = new ObjectId(_article_id);
          const article = await collection.findOne({ _id });
          resolve({ status: true, data: article });
        } catch (err) {
          reject({ status: false, message: err.message });
        }
      });
    });
  }

  static validate(articaleData) {
    try {
      const validateResult = articleValidator.validate(articaleData);
      return validateResult;
    } catch (error) {
      return { error: error };
    }
  }

  static updateLikes(_article_id, increment) {
    return new Promise((resolve, reject) => {
      Article.articaleDbConnection(async (collection) => {
        try {
          const _id = new ObjectId(_article_id);
          // increment can be 1 (like) or -1 (unlike)
          await collection.updateOne({ _id }, { $inc: { likes: increment } });
          resolve({ status: true });
        } catch (err) {
          reject({ status: false, message: err.message });
        }
      });
    });
  }
}

module.exports = Article;
