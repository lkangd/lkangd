<template>
  <section class="post cs-container-big">
    <h2 class="cs-title-big">{{ post.attributes && post.attributes.title }}</h2>
    <p class="cs-date">{{ post.attributes && post.attributes.date | formatDate('DD, MMM, YYYY') }}</p>
    <article
      class="cs-post-article"
      v-html="$md.render(post.body || '')"
    />
    <!-- <article v-html="Article" /> -->
    <cs-statement />
  </section>
</template>

<script>
/* eslint-disable no-console */
// import Article from '@/posts/fun/why-do-we-write-super-props.md';
import CsStatement from '@/components/CsStatement';
import appConfig from '@/config/app.config';

export default {
  name: 'post',
  head() {
    return {
      title: `${(this.post.attributes && this.post.attributes.title) || 'Article'} - ${appConfig.meta.title}`,
    };
  },
  async asyncData({ $axios, $payloadURL, route, payload }) {
    if (process.static && process.client) {
      return await $axios.$get($payloadURL(route));
    }

    return { post: (payload && payload.post) || {} };
  },
  data() {
    return {
      // Article,
    };
  },
  mounted() {
    if (this.post.link) {
      localStorage.setItem('article', JSON.stringify(this.post));
    } else {
      this.post = JSON.parse(localStorage.getItem('article'));
    }
    Prism.highlightAll();
  },
  components: { CsStatement },
};
</script>

<style lang="less">
.post {
  background-color: transparent;
  .cs-post-article {
    a {
      padding: 0 4px;
      text-decoration: underline;
    }
    h2 {
      margin: 24px 0;
      font-size: 20px;
      font-weight: bold;
    }
    h3 {
      margin: 24px 0;
      font-size: 18px;
      font-weight: bold;
    }
    p,
    li {
      margin: 24px 0;
      font-size: 16px;
      line-height: 28px;
    }
    code:not([class*='language-']) {
      padding: 0 4px;
      font-family: Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace;
      color: rgba(49, 51, 51, 0.9);
      // background-color: rgba(79, 192, 141, 0.4);
      background-color: rgba(255, 233, 87, 0.4);
      border-radius: 3px;
    }
    strong em {
      margin: 0 6px;
      font-weight: bold;
    }
    hr {
      margin: 30px 0;
      border: 0;
      border-bottom: 1px solid #a7adba;
    }
    em {
      margin: 0 6px;
    }
    pre {
      background-color: rgb(1, 22, 39);
      border-radius: 10px;
    }
    ul {
      li {
        font-size: 16px;
        line-height: 28px;
        list-style: disc;
      }
    }
    ol {
      li {
        list-style: decimal;
      }
    }
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>