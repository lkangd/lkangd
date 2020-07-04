const fs = require('fs');
const path = require('path');

const getCachePath = filename => path.resolve(__dirname, `./.cache/${filename ? '/' + filename : ''}`);

export default class CacheManager {
  constructor() {
    const cachePath = getCachePath();
    !fs.existsSync(cachePath) && fs.mkdirSync(cachePath);

    this.nameMap = fs.readdirSync(cachePath).reduce((res, item) => {
      res[item] = false;
      return res;
    }, Object.create(null));
  }
  has(cacheName) {
    return this.nameMap[cacheName];
  }
  activate(cacheName) {
    this.nameMap[cacheName] = true;
  }
  deactivate() {
    this.nameMap[cacheName] = false;
  }
  remove(cacheName) {
    this.nameMap[cacheName] === false &&
      fs.unlink(path.resolve(__dirname, `./.cache/${cacheName}`), err => {
        !err && delete this.nameMap[cacheName];
      });
  }
  clearInactive() {
    Object.keys(this.nameMap).forEach(cacheName => this.remove(cacheName));
  }
  readCache(cacheName) {
    let buffer;
    try {
      buffer = fs.readFileSync(getCachePath(cacheName));
      buffer = JSON.parse(buffer).content;
    } catch (e) {}
    return buffer;
  }
  writeCache(cacheName, content) {
    try {
      fs.writeFileSync(getCachePath(cacheName), JSON.stringify({ content }));
      this.activate(cacheName);
    } catch (e) {}
  }
}
