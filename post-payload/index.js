const { min2read, wordcount } = require('../utils/wordcount');
const CacheManager = require('./cache-manager');
const md = require('../utils/markdown-it');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const frontMatter = require('front-matter');

const cachedManager = new CacheManager();
const isGenerateMode = process.env.GENERATE_MODE === 'deploy' || process.env.GENERATE_MODE === 'normal';
const afterHooks = {
  run() {
    for (let i = 0; i < this.fns.length; i++) {
      const fn = this.fns[i];
      typeof fn === 'function' && fn();
    }
  },
  add(fn) {
    this.fns.push(fn);
  },
  fns: [],
};

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
        const cacheName = `${dirPath.split('/').pop()}.${getCacheFilename(subDirPath, file)}`;
        if (cachedManager.has(cacheName)) {
          cachedManager.activate(cacheName);
          result.push(cachedManager.readCache(cacheName));
          return;
        }
        const post = frontMatter(file);

        post.body = updateImgPath(String(md.render(post.body)), dirPath);
        post.attributes.link = post.link = `/post/${
          path.basename(subDirPath, '.md') === 'index' ? path.basename(dirPath) : fileName.replace(/\..*$/, '')
        }/`;
        post.attributes.min2read = min2read(post.body);
        post.attributes.wordcount = wordcount(post.body);
        cachedManager.writeCache(cacheName, post);
        if (isGenerateMode) {
          !post.attributes.draft && result.push(post);
        } else {
          result.push(post);
        }
      }
    });
  };
  walker(dirPath, result);
  return result;
};

let raw;
const processing = () => {
  const posts = (raw = postPayload('./posts'));
  const result = [];
  const cacheName = `post-payload.${getCacheFilename(undefined, JSON.stringify(posts))}`;
  if (cachedManager.has(cacheName)) {
    cachedManager.activate(cacheName);
    cachedManager.clearInactive();
    return cachedManager.readCache(cacheName);
  }
  const allPosts = [];
  const featuredPosts = [];
  for (const key in posts) {
    if (posts.hasOwnProperty(key)) {
      const category = posts[key];
      result.push({ route: `/${key}`, payload: { postList: category.map(({ attributes }) => attributes).sort(sortArticleByDate) } });
      result[`/${key}`] = { postList: category.map(({ attributes }) => attributes).sort(sortArticleByDate) };
      category.forEach((post, index) => {
        try {
          if (post.attributes.featured) {
            featuredPosts.push(post.attributes);
          } else {
            allPosts.push(post.attributes);
          }
        } catch (error) {
          console.log('error :>> ', error);
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
    postList: allPosts.sort(sortArticleByDate),
    featuredList: featuredPosts.sort(sortArticleByDate),
  };
  result.push({
    route: '/',
    payload: rootPayload,
  });
  result['/'] = rootPayload;
  cachedManager.writeCache(cacheName, result);
  cachedManager.clearInactive();
  return result;
};
// 路由化处理
const processed = processing();

module.exports = { raw, processing, processed, afterHooks };

function updateImgPath(target, fillPath) {
  const regExp = /src="(.*?(([^\/]*)\.(gif|jpe?g|png|svg)))/gim;
  return target.replace(regExp, (...w) => {
    let fileUrl = w[1];
    if (/^http/.test(fileUrl)) {
      return w[0];
    }
    if (isGenerateMode) {
      try {
        const resourcePath = path.resolve(__dirname, '..', fillPath, fileUrl);
        const hex = genHex(resourcePath);
        fileUrl = `_nuxt/img/${w[3]}.${hex}.${w[4]}`;
        afterHooks.add(function() {
          copyFile(resourcePath, path.join(__dirname, `../dist/${fileUrl}`));
        });
      } catch (error) {
        console.log('replace file error :>> ', error);
      }
    } else {
      fileUrl = `./static/${fillPath}/${w[1]}`;
    }
    return w[0].replace(w[1], fileUrl);
  });
}

function genHex(file, source, length = 7) {
  let md5;
  try {
    const buffer = source || fs.readFileSync(file);
    const fsHash = crypto.createHash('md5');
    fsHash.update(buffer);
    md5 = fsHash.digest('hex');
  } catch (error) {}
  return md5 ? `${md5.slice(0, length)}` : '';
}

function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

function getCacheFilename(dir, source, suffix = 'json') {
  const filename = genHex(dir, source);

  return filename ? `${filename}.${suffix}` : '';
}

function sortArticleByDate(a, b) {
  return new Date(b.date) - new Date(a.date);
}
