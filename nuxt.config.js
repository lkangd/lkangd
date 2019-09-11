const LessPluginFunctions = require('less-plugin-functions');
const appConfig = require('./config/app.config');
const postPayload = require('./post-payload');

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: appConfig.meta.title || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: appConfig.meta.description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Noto+Serif+SC&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:900&display=swap' },
    ],
    __dangerouslyDisableSanitizers: ['script'],
    script: [
      {
        type: 'text/javascript',
        body: true,
        innerHTML: `(function() {
                      function setTheme(newTheme) {
                        preferredTheme = newTheme;
                        document.body.className = newTheme;
                      }

                      var themes = { light: 'light', dark: 'dark' }
                      var preferredTheme;
                      try {
                        preferredTheme = localStorage.getItem('theme');
                      } catch (err) {}

                      window.__setPreferredTheme = function(newTheme) {
                        setTheme(newTheme);
                        try {
                          localStorage.setItem('theme', newTheme);
                        } catch (err) {}
                      }

                      var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                      darkQuery.addListener(function(e) {
                        window.__setPreferredTheme(themes[preferredTheme] || (e.matches ? 'dark' : 'light'));
                      });

                      setTheme(themes[preferredTheme] || (darkQuery.matches ? 'dark' : 'light'));
                    })();`,
      },
    ],
  },
  generate: {
    // subFolders: false,
    routes(callback) {
      const posts = postPayload;
      const result = [];
      const allPosts = [];
      const featuredPosts = [];
      for (const key in posts) {
        if (posts.hasOwnProperty(key)) {
          const category = posts[key];
          result.push({ route: `/${key}`, payload: { postList: category.map(({ attributes }) => attributes) } });
          category.forEach((post, index) => {
            allPosts.push(post.attributes);
            post.attributes.featured && featuredPosts.push(post.attributes);

            const next = category[index + 1] && category[index + 1].attributes;
            const prev = category[index - 1] && category[index - 1].attributes;
            result.push({
              route: post.link,
              payload: { post: { ...post, next, prev } },
            });
          });
        }
      }
      result.push({
        route: '/',
        payload: {
          postList: allPosts.sort((a, b) => b.date - a.date),
          featuredList: featuredPosts.sort((a, b) => b.date - a.date),
        },
      });
      callback(null, result);
    },
  },
  router: {
    base: process.env.GENERTATE_MODE === 'deploy' ? '/lkangd.com/' : '',
  },
  server: {
    port: 8080, // default: 3000
    host: '127.0.0.1', // default: localhost,
  },
  /*
   ** Customize the loading component
   */
  loading: '@/components/CsLoading.vue',
  /*
   ** Global CSS
   */
  styleResources: {
    less: ['@/assets/less/vars/*.less', '@/assets/less/mixins.less'],
  },
  css: [
    {
      src: '@/assets/less/index.less',
      lang: 'less',
    },
    {
      src: '@/assets/less/prism.less',
      lang: 'less',
    },
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/vue-filters', '@/plugins/vue-directives'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/feed',
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
    '@nuxtjs/svg-sprite',
    [
      'nuxt-payload-extractor',
      {
        versioning: true,
      },
    ],
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-106568709-1',
      },
    ],
  ],
  sitemap: {
    hostname: appConfig.meta.url,
    routes() {
      return new Promise(resolve => {
        const result = [];
        const posts = postPayload;
        for (const key in posts) {
          if (posts.hasOwnProperty(key)) {
            const category = posts[key];
            result.push(`/${key}`);
            category.forEach(post => {
              result.push(post.link);
            });
          }
        }
        result.push('/');
        resolve(result);
      });
    },
  },
  feed: [
    {
      path: '/feed.xml',
      create(feed) {
        feed.options = {
          title: appConfig.meta.title,
          id: `${appConfig.meta.url}/feed.xml`,
          link: `${appConfig.meta.url}/feed.xml`,
          favicon: `${appConfig.meta.url}/favicon.png`,
          copyright: `All rights reserved ${new Date().getFullYear()}, ${appConfig.meta.author}`,
          description: appConfig.meta.description,
        };
        const posts = postPayload;
        for (const key in posts) {
          if (posts.hasOwnProperty(key)) {
            posts[key].forEach(post => {
              feed.addItem({
                title: post.attributes.title,
                id: post.attributes.link,
                link: post.attributes.link,
                description: post.attributes.spoiler,
                content: post.body,
              });
            });
          }
        }
        feed.addCategory(appConfig.meta.title);
        feed.addContributor({
          name: appConfig.meta.author,
          email: appConfig.meta.email,
          link: `${appConfig.meta.url}/feed.xml`,
        });
      },
      cacheTime: 1000 * 60 * 15,
      type: 'rss2',
    },
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    babel: {
      plugins: [
        [
          'prismjs',
          {
            languages: ['javascript', 'jsx', 'css', 'markup'],
            plugins: ['line-highlight'],
            css: true,
          },
        ],
      ],
    },
    extend(config, ctx) {
      // 增加 less 自定义 function 插件
      if (ctx.isClient) {
        ctx.loaders.less.plugins = [new LessPluginFunctions()];
      }
    },
  },
};
