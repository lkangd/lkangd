import { min2read, wordcount } from './utils/wordcount';
import md from './utils/markdown-it';
const fs = require('fs');
const frontMatter = require('front-matter');

module.exports = dirPath => {
  const result = {};
  const walker = (dirPath, result) => {
    const dirList = fs.readdirSync(dirPath);
    dirList.forEach(fileName => {
      // '.xxx' exception
      if (/^\./.test(fileName)) return;

      const subDirPath = `${dirPath}/${fileName}`;
      const stat = fs.statSync(subDirPath);
      if (stat.isDirectory()) {
        result[fileName] = [];
        walker(subDirPath, result[fileName]);
      } else {
        const file = fs.readFileSync(subDirPath, 'utf8');
        const post = frontMatter(file);

        post.body = String(md.render(post.body));
        post.attributes.link = post.link = `/post/${fileName.replace(/\..*$/, '')}`;
        post.attributes.min2read = min2read(post.body);
        post.attributes.wordcount = wordcount(post.body);
        result.push(post);
      }
    });
  };
  walker(dirPath, result);
  return result;
};
