const appConfig = require('./config/app.config');
const postPayload = require('./post-payload');
import md from './utils/markdown-it';

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: appConfig.meta.title || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0' },
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
      callback(null, postPayload.processed);
      setTimeout(() => {
        postPayload.afterHooks.run();
      }, 0);
    },
  },
  router: {
    // base: process.env.GENERATE_MODE === 'deploy' ? '/lkangd.com/' : '',
    base: '',
  },
  server: {
    port: 8080, // default: 3000
    host: '127.0.0.1', // default: localhost,
  },
  serverMiddleware: [
    // develoment API middleware
    '@/api',
    '@/api/static',
  ],
  watch: ['@/posts/**/*.md'],
  /*
   ** Customize the loading component
   */
  loading: '@/components/CsLoading.vue',
  /*
   ** Global CSS
   */
  styleResources: {
    scss: ['@/assets/scss/mixins.scss', '@/assets/scss/utils.scss', '@/assets/scss/function.scss', '@/assets/scss/theme.scss'],
  },
  css: [
    {
      src: '@/assets/scss/index.scss',
      lang: 'scss',
    },
    {
      src: '@/assets/scss/prism.scss',
      lang: 'scss',
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
    '@nuxtjs/markdownit',
    '@nuxtjs/style-resources',
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
  markdownit: md,
  sitemap: {
    hostname: appConfig.meta.url,
    routes() {
      return new Promise(resolve => {
        const result = [];
        const posts = postPayload.raw;
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
        const posts = postPayload.raw;
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
    cache: true,
    parallel: true,
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
      // // 增加 less 自定义 function 插件
      // if (ctx.isClient) {
      //   ctx.loaders.less.plugins = [new LessPluginFunctions()];
      // }
    },
  },
};
