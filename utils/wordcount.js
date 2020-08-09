const striptags = require('striptags');

const CN_REGEXP = /[\u4E00-\u9FA5]/gm;
const EN_REGEXP = /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/gm;

function counter(content) {
  content = striptags(content);
  const cn = (content.match(CN_REGEXP) || []).length;
  const en = (content.replace(CN_REGEXP, '').match(EN_REGEXP) || []).length;
  return [cn, en];
}

function min2read(content, { cnReadPerMs = 300, enReadPerMs = 160 } = {}) {
  const [cnCount, enCount] = counter(content);
  let readingTime = cnCount / cnReadPerMs + enCount / enReadPerMs;
  readingTime = readingTime < 1 ? '1' : parseInt(readingTime, 10);
  return formatReadingTime(readingTime);
}

function wordcount(content) {
  const [cnCount, enCount] = counter(content);
  const totalCount = cnCount + enCount;
  if (totalCount < 1000) return totalCount;

  return Math.round(totalCount / 100) / 10 + 'k';
}

function formatReadingTime(minutes) {
  const cups = Math.round(minutes / 5);
  if (cups > 5) {
    return `${new Array(Math.round(cups / Math.E)).fill('🍱').join('')} ${minutes} min read`;
  } else {
    return `${new Array(cups || 1).fill('☕️').join('')} ${minutes} min read`;
  }
}

module.exports = { counter, min2read, wordcount, formatReadingTime };
