const Cheerio = require("cheerio");
const { Article } = require("../models");

const getArticles = async () => {
  return new Promise(async (resolve, reject) => {
    const articlesData = [];
    try {
      for (let i = 1; i <= 10; i++) {
        const URL =
          `https://www.motqdmon.com/search/label/%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A7%D8%AA?` +
          (articlesData.length > 0
            ? `updated-max=${encodeURIComponent(
                articlesData[articlesData.length - 1].articaleData.date,
              )}&`
            : "") +
          `max-results=6#PageNo=${i}`;

        const response = await fetch(URL);
        const html = await response.text();
        const $ = Cheerio.load(html);
        // Use CSS selectors specific to the target website
        $(".post article").each((_index, element) => {
          const titleLink = $(element).find(".post-title.entry-title a");
          const title = titleLink.text().trim();
          const link = titleLink.attr("href");
          const date = $(element).find("abbr.published").attr("title");

          const articleData = { title, date, link, likes: 0 };
          const resultValidate = Article.validate(articleData);

          if (!resultValidate.error) {
            articlesData.push(new Article(articleData));
          }
        });
      }
      // Remove duplicates using Set
      const existing = await Article.getAllArticles();
      if (existing.status) {
        let newArticles = articlesData;
        if (existing.data.length > 0) {
          const existingLinks = new Set(existing.data.map((a) => a.link));
          newArticles = articlesData.filter(
            (a) => !existingLinks.has(a.articaleData.link),
          );
        }
        newArticles = newArticles.map((article) => article.articaleData);

        resolve({ status: true, data: newArticles });
      }
    } catch (error) {
      reject({ status: false, message: error.message });
    }
  });
};
module.exports = { getArticles };
