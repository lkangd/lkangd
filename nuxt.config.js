const appConfig = require('./config/app.config');
const LessPluginFunctions = require('less-plugin-functions');
const postPayload = require('./post-payload');
const path = require('path');

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
  },
  generate: {
    // subFolders: false,
    routes(callback) {
      const res = postPayload(path.resolve(__dirname, './posts'));
      const result = [];
      const allPosts = [];
      const featuredPosts = [];
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const category = res[key];
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
    // base: '/dist',
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
  plugins: ['@/plugins/vue-filters', '@/plugins/vue-directives', '@/plugins/prism'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/feed',
    '@nuxtjs/axios',
    '@nuxtjs/svg-sprite',
    'nuxt-payload-extractor',
    [
      '@nuxtjs/markdownit',
      {
        html: true,
        linkify: true,
        breaks: true,
      },
    ],
  ],
  feed: [
    {
      path: '/feed.xml',
      create(feed) {
        feed.options = {
          title: "Curtis' Spot",
          link: 'http://127.0.0.1:8080/feed.xml',
          description: 'Front-end Engineer. Blogging about life, tech & everything I love.',
        };
        const posts = postPayload(path.resolve(__dirname, './posts'));
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
        feed.addCategory("Curtis' Spot");
        feed.addContributor({
          name: 'Curtis Liong',
          email: 'lkangd@gmail.com',
          link: 'http://127.0.0.1:8080',
        });
      },
      cacheTime: 1000 * 60 * 15,
      type: 'rss2',
    },
  ],
  markdownit: {
    injected: true,
    use: ['markdown-it-attrs'],
  },
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
    extend(config, ctx) {
      // 增加 less 自定义 function 插件
      if (ctx.isClient) {
        ctx.loaders.less.plugins = [new LessPluginFunctions()];
      }
    },
  },
};
