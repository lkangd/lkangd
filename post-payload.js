import { min2read, wordcount } from './utils/wordcount';
import md from './utils/markdown-it';
const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
const isGenerateMode = process.argv.pop() === 'generate';

const postPayload = dirPath => {
  const result = {};
  const walker = (dirPath, result, layer = 0) => {
    const dirList = fs.readdirSync(dirPath);
    dirList.forEach(fileName => {
      // '.xxx' exception
      if (/^\./.test(fileName)) return;

      const subDirPath = `${dirPath}/${fileName}`;
      const stat = fs.statSync(subDirPath);
      if (stat.isDirectory() && layer === 0) {
        // classification
        result[fileName] = [];
        walker(subDirPath, result[fileName], layer + 1);
      } else if (stat.isDirectory() && layer === 1) {
        // article
        walker(subDirPath, result, layer + 1);
      } else if (stat.isDirectory() && layer > 1) {
        return;
      } else if (path.extname(fileName) === '.md') {
        const file = fs.readFileSync(subDirPath, 'utf8');
        const post = frontMatter(file);

        post.body = updateImgPath(String(md.render(post.body)), dirPath);
        post.attributes.link = post.link = `/post/${
          path.basename(subDirPath, '.md') === 'index' ? path.basename(dirPath) : fileName.replace(/\..*$/, '')
        }`;
        post.attributes.min2read = min2read(post.body);
        post.attributes.wordcount = wordcount(post.body);
        result.push(post);
      }
    });
  };
  walker(dirPath, result);
  return result;
};

const raw = postPayload('./posts');
// 路由化处理
const processed = (() => {
  const posts = raw;
  const result = [];
  const allPosts = [];
  const featuredPosts = [];
  for (const key in posts) {
    if (posts.hasOwnProperty(key)) {
      const category = posts[key];
      result.push({ route: `/${key}`, payload: { postList: category.map(({ attributes }) => attributes) } });
      result[`/${key}`] = { postList: category.map(({ attributes }) => attributes) };
      category.forEach((post, index) => {
        if (post.attributes.featured) {
          featuredPosts.push(post.attributes);
        } else {
          allPosts.push(post.attributes);
        }

        const next = category[index + 1] && category[index + 1].attributes;
        const prev = category[index - 1] && category[index - 1].attributes;
        result.push({
          route: post.link,
          payload: { post: { ...post, next, prev } },
        });
        result[post.link] = { post: { ...post, next, prev } };
      });
    }
  }
  const rootPayload = {
    postList: allPosts.sort((a, b) => b.date - a.date),
    featuredList: featuredPosts.sort((a, b) => b.date - a.date),
  };
  result.push({
    route: '/',
    payload: rootPayload,
  });
  result['/'] = rootPayload;
  return result;
})();

module.exports = { raw, processed };

function updateImgPath(target, fillPath) {
  if (isGenerateMode) {
    return target;
  } else {
    return target.replace(/src="(.*?([^\/]*\.(gif|jpe?g|png)))/g, (...w) => w[0].replace(w[1], `./static/${fillPath}/${w[1]}`));
  }
}
