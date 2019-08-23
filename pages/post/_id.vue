<template>
  <section class="post cs-container-big">
    <template v-if="post.attributes">
      <h2 class="cs-title-big">{{ post.attributes.title }}</h2>
      <p
        class="cs-date"
      >{{ post.attributes.date | formatDate('DD, MMM, YYYY') }}•{{ post.attributes.wordcount }} words•{{ post.attributes.min2read }}</p>
    </template>
    <article
      class="cs-post-article"
      v-html="$md.render(post.body || '')"
    />
    <!-- <article v-html="Article" /> -->
    <hr />
    <div class="post__wrapper">
      <nuxt-link
        :to="post.next.link"
        class="cs-outside-link fr"
        v-if="post.next"
      >{{ post.next.title }} →</nuxt-link>
      <nuxt-link
        :to="post.prev.link"
        class="cs-outside-link fl"
        v-if="post.prev"
      >← {{ post.prev.title }}</nuxt-link>
    </div>
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
  beforeMount() {
    this.$md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
      const token = tokens[idx];
      const dataLine = token.attrs && token.attrs[0];

      return `<pre ${(dataLine && 'data-line="' + dataLine + '"') || ''} ${slf.renderAttrs(token)}><code class="language-${token.info}">${
        token.content
      }</code></pre>`;
    };
  },
  mounted() {
    if (this.post.link) {
      localStorage.setItem('article', JSON.stringify(this.post));
    } else {
      this.post = JSON.parse(localStorage.getItem('article'));
    }
    console.log('this.post :', this.post);
    Prism.highlightAll();
  },
  components: { CsStatement },
};
</script>

<style lang="less">
.post {
  background-color: transparent;
  hr {
    margin: 64px 0;
    border: 0;
    border-bottom: 1px solid var(--hr);
  }
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
      color: var(--text-normal);
    }
    code:not([class*='language-']) {
      padding: 0 4px;
      font-family: Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace;
      color: var(--inline-code-fg);
      background-color: var(--inline-code-bg);
      border-radius: 3px;
    }
    strong em {
      margin: 0 6px;
      font-weight: bold;
    }
    hr {
      margin: 30px 0;
      border: 0;
      border-bottom: 1px solid var(--hr);
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
  &__wrapper {
    overflow: hidden;
    > a {
      margin: 20px 0;
    }
  }
}
</style>