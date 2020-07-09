const toPinyin = require('pinyin');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTOC = require('markdown-it-table-of-contents');

const slugify = slug =>
  toPinyin(slug, {
    style: toPinyin.STYLE_NORMAL,
  })
    .join('')
    .replace(/[^\w]/g, '');

let md = require('markdown-it')({ html: true, linkify: true, breaks: true });
md.use(markdownItAttrs);
md.use(markdownItAnchor, {
  level: 2,
  slugify,
  permalink: true,
  permalinkClass: 'cs-header-anchor',
  permalinkSymbol: '¶',
  permalinkBefore: true,
  permalinkHref: slug => '',
  permalinkAttrs: slug => ({
    onclick: `!this.getAttribute('href') && this.setAttribute('href', window.location.origin+window.location.pathname+'#'+'${slug}')`,
  }),
});
md.use(markdownItTOC, {
  includeLevel: [2, 3],
  containerClass: 'cs-toc-dom',
  forceFullToc: true,
  slugify,
});

const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function unescapeAll(str) {
  if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) {
    return str;
  }

  return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
    if (escaped) {
      return escaped;
    }
    return replaceEntityPattern(match, entity);
  });
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
  var token = tokens[idx],
    info = token.info ? unescapeAll(token.info).trim() : '',
    langName = '',
    highlighted,
    i,
    tmpAttrs,
    tmpToken;

  if (info) {
    langName = info.split(/\s+/g)[0];
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n';
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .clone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];
    // fix code line highlight: ['1,2,3,4', ''] => ['data-line', '1,2,3,4']
    tmpAttrs.forEach(attr => {
      if (/^((\d|\d\-\d),?)+$/.test(attr[0]) && !attr[1]) {
        [attr[0], attr[1]] = ['data-line', attr[0]];
      }
    });

    if (i < 0) {
      tmpAttrs.push(['class', options.langPrefix + langName]);
    } else {
      tmpAttrs[i][1] += '' + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = { attrs: tmpAttrs };

    return `<pre ${slf.renderAttrs(tmpToken)}><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>`;
  }

  return `<pre${slf.renderAttrs(token)}><code${slf.renderAttrs(token)}>${highlighted}</code></pre>`;
};

md = Object.assign({}, md, Object.getPrototypeOf(md));

export default md;
