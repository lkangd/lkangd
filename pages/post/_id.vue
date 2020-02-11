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
      v-html="post.body"
    />
    <div
      class="post__wrapper"
      v-if="post.next || post.prev"
    >
      <hr />
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
import Prism from 'prismjs';
import CsStatement from '@/components/CsStatement';
import appConfig from '@/config/app.config';

export default {
  name: 'post',
  head() {
    return {
      title: `${(this.post.attributes && this.post.attributes.title) || 'Article'} - ${appConfig.meta.title}`,
    };
  },
  async asyncData({ $axios, $payloadURL, route, payload, redirect }) {
    try {
      if (process.static && process.client) {
        return await $axios.$get($payloadURL(route));
      } else {
        return await $axios.$get(`/api${route.path}`);
      }
    } catch (e) {
      redirect('/404');
      return { post: (payload && payload.post) || {} };
    }
  },
  mounted() {
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
    h1 {
      margin: 50px 0 24px;
      font-size: 22px;
      font-weight: bold;
    }
    h2 {
      margin: 50px 0 24px;
      font-size: 20px;
      font-weight: bold;
    }
    h3 {
      margin: 50px 0 24px;
      font-size: 18px;
      font-weight: bold;
    }
    h4 {
      margin: 30px 0 24px;
      font-size: 16px;
      font-weight: bold;
    }
    h5 {
      margin: 30px 0 24px;
      font-size: 14px;
      font-weight: bold;
    }
    h6 {
      margin: 30px 0 24px;
      font-size: 12px;
      font-weight: bold;
    }
    p,
    li,
    td {
      margin: 0;
      font-size: 16px;
      line-height: 28px;
      color: var(--text-normal);
    }
    p {
      margin-bottom: 24px;
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
      margin: 24px 0;
      background-color: rgb(1, 22, 39);
      border-radius: 10px;
    }
    blockquote {
      background: var(--blockquote-bg);
      border-left: 10px solid var(--blockquote-bl);
      margin: 24px 10px;
      padding: 16px 10px;
      quotes: '\201C''\201D''\2018''\2019';
      p {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    ul {
      margin: 24px 0;
      padding-left: 40px;
      li {
        text-align: -webkit-match-parent;
        font-size: 16px;
        line-height: 28px;
        list-style: disc;
      }
    }
    ol {
      margin: 24px 0;
      padding-left: 40px;
      li {
        list-style: decimal;
      }
    }
    img {
      width: 100%;
      height: auto;
    }
    table {
      margin: 24px 0;
      width: 100%;
      max-width: 100%;
      border: 1px solid #dee2e6;
      thead {
        tr {
          th {
            padding: 12px;
            font-weight: bold;
            color: #495057;
            background-color: #e9ecef;
            border-bottom: 2px solid #dee2e6;
            + th {
              border-left: 1px solid #dee2e6;
            }
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 12px;
            + td {
              border-left: 1px solid #dee2e6;
            }
          }
          + tr {
            border-top: 1px solid #dee2e6;
          }
        }
      }
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