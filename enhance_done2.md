# Advanced Enhancement Suggestions

## ⚡ Performance & Concurrency

### 1. Atomic Updates for Likes (Critical)

The current implementation of `addLike` in `controllers/like.js` suffers from a race condition. It fetches the article to get the current like count and then updates it with a calculated value. Concurrent requests will result in lost updates (e.g., 10 users liking simultaneously might only increase the count by 1).

**Recommendation:**
Use MongoDB's atomic `$inc` operator instead of setting a fixed value. This pushes the logic to the database engine, which handles concurrency safely.

**Refactored `models/Articles.js`:**

```javascript
static updateLikes(_article_id, increment) {
  return new Promise((resolve, reject) => {
    Article.articaleDbConnection(async (collection) => {
      try {
        const _id = new ObjectId(_article_id);
        // increment can be 1 (like) or -1 (unlike)
        await collection.updateOne({ _id }, { $inc: { likes: increment } });
        resolve({ status: true });
      } catch (err) {
        resolve({ status: false, message: err.message });
      }
    });
  });
}
```

### 2. Database Indexing

Ensure efficient query execution by defining indexes.

- **Likes Collection:**
  - `{ _user_id: 1, _article_id: 1 }`: **Compound Unique Index**. This prevents a user from liking the same article multiple times at the database level, ensuring data integrity even if the application logic fails.
- **Articles Collection:**
  - `{ createdAt: -1 }`: Optimizes sorting articles by date.

## 🛡️ Security

### 1. HTTP Parameter Pollution (HPP)

Attackers can sometimes bypass validation or cause errors by sending multiple parameters with the same name (e.g., `?page=1&page=2`). Express might parse this as an array `['1', '2']`, potentially breaking logic expecting a string.

**Recommendation:**
Use the `hpp` middleware in `app.js`.

```javascript
const hpp = require("hpp");
app.use(hpp());
```

### 2. Request Body Size Limiting

Prevent Denial of Service (DoS) attacks by limiting the size of the request body.

```javascript
// app.js
app.use(express.json({ limit: "10kb" })); // Adjust limit as needed
```

## 🏗️ Code Quality & Modernization

### 1. Async/Await Refactoring

The `saveAll` method in `models/Articles.js` uses callbacks, while other parts of the app use Promises. Refactoring to return a Promise allows for cleaner `async/await` usage in `index.js`.

**Refactored `saveAll` in `models/Articles.js`:**

```javascript
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
        resolve({ status: false, message: err.message });
      }
    });
  });
}
```

### 2. Environment Variable Validation

Ensure strictly typed environment variables. If `MONGODB_URI` is missing, the app might crash unexpectedly later.

**Recommendation:**
Use a library like `envalid` or check variables at the start of `index.js`.

```javascript
if (!process.env.MONGODB_URI) {
  console.error("FATAL: MONGODB_URI is not defined.");
  process.exit(1);
}
```
