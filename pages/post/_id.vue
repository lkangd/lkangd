<template>
  <section class="cs-post cs-container">
    <cs-theme-toggle class="cs-post__toggle" />
    <h3 class="cs-post__blog-name">
      <nuxt-link to="/">Curtis' Spot</nuxt-link>
    </h3>
    <template v-if="post.attributes">
      <h2 class="cs-post__title">{{ post.attributes.title }}</h2>
      <p
        class="cs-post__info"
      >{{ post.attributes.date | formatDate('DD, MMM, YYYY') }}&nbsp;•&nbsp;{{ post.attributes.wordcount }} words&nbsp;•&nbsp;{{ post.attributes.min2read }}</p>
    </template>
    <article
      class="cs-post__article"
      v-html="post.body"
    />
    <hr />
    <template v-if="post.next || post.prev">
      <div class="cs-post__link-wrapper">
        <nuxt-link
          :to="post.prev.link"
          class="cs-outside-link"
          v-if="post.prev"
        >← {{ post.prev.title }}</nuxt-link>
        <nuxt-link
          :to="post.next.link"
          class="cs-outside-link"
          v-if="post.next"
        >{{ post.next.title }} →</nuxt-link>
      </div>
      <hr />
    </template>
    <cs-subscribe />
    <cs-statement />
    <cs-toc />
  </section>
</template>

<script>
/* eslint-disable no-console */
import Prism from 'prismjs';
import CsThemeToggle from '@/components/CsThemeToggle';
import CsStatement from '@/components/CsStatement';
import CsSubscribe from '@/components/CsSubscribe';
import CsToc from '@/components/CsToc';
import appConfig from '@/config/app.config';

export default {
  name: 'cs-post',
  layout: 'post',
  components: { CsThemeToggle, CsStatement, CsSubscribe, CsToc },
  head() {
    return {
      title: `${(this.post.attributes && this.post.attributes.title) || 'Article'} - ${appConfig.meta.title}`,
      // script: [{ src: 'https://lkangd.ck.page/51a87aa3a3/index.js', body: true, 'data-uid': '51a87aa3a3', async: true }],
    };
  },
  async asyncData({ $axios, route }) {
    return await $axios.$get(`http://localhost:8080/api${route.path}`);
  },
  mounted() {
    Prism.highlightAll();
  },
};
</script>

<style lang="scss">
@include B(post) {
  position: relative;
  padding: 42px 21px !important;
  background-color: transparent;
  @include e(toggle) {
    position: absolute;
    top: 52px;
    right: 21px;
  }
  @include e(blog-name) {
    margin-bottom: 42px;
    height: 42px;
    font-family: Montserrat, sans-serif;
    font-size: 23px;
    font-weight: 900;
    line-height: 2.625rem;
    > a {
      color: var(--main) !important;
      box-shadow: none;
    }
  }
  @include e(title) {
    margin-top: 56px;
    line-height: 44px;
    font-size: 40px;
    font-family: 'Montserrat', serif;
    font-weight: 900;
    color: var(--text-title);
  }
  @include e(info) {
    margin-bottom: 28px;
    line-height: 2;
    font-size: 14px;
    font-family: 'Merriweather', 'Georgia', serif;
    word-spacing: 2px;
  }
  hr {
    margin: 64px 0;
    border: 0;
    border-bottom: 1px solid var(--hr);
  }
  @include e(link-wrapper) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    // overflow: hidden;
    > a {
      margin: 20px 0;
    }
  }
  @include e(article) {
    a {
      padding: 0 4px;
      text-decoration: underline;
    }
    h1 {
      margin: 50px 0 24px;
      font-size: 28px;
      font-weight: bold;
    }
    h2 {
      margin: 50px 0 24px;
      font-size: 25px;
      font-weight: bold;
    }
    h3 {
      margin: 50px 0 24px;
      font-size: 22px;
      font-weight: bold;
    }
    h4 {
      margin: 30px 0 24px;
      font-size: 19px;
      font-weight: bold;
    }
    h5 {
      margin: 30px 0 24px;
      font-size: 16px;
      font-weight: bold;
    }
    h6 {
      margin: 30px 0 24px;
      font-size: 13px;
      font-weight: bold;
    }
    p,
    li,
    td {
      margin: 0;
      font-size: 14px;
      line-height: 28px;
      color: var(--text-normal);
    }
    p {
      margin-bottom: 24px;
    }
    code:not([class*='language-']) {
      margin: 0 4px;
      padding: 0 4px;
      font-family: Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace;
      font-weight: bold;
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
      font-size: 12px;
      border-radius: 10px;
      background-color: #011627;
      opacity: 0.99;
    }
    blockquote {
      background: var(--blockquote-bg);
      border-left: 6px solid var(--blockquote-bl);
      margin: 24px 6px;
      padding: 16px 10px;
      quotes: '\201C''\201D''\2018''\2019';
      p {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    li + li {
      margin-top: 10px;
    }
    ul {
      margin: 24px 0;
      padding-left: 30px;
      li {
        text-align: -webkit-match-parent;
        line-height: 28px;
        list-style: disc;
        ul {
          li {
            list-style: circle;
          }
        }
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
      display: block;
      margin: 50px auto;
      max-width: 80%;
      height: auto;
    }
    table {
      display: inline-block;
      margin: 0;
      margin-bottom: 24px;
      max-width: 100%;
      border: 1px solid #dee2e6;
      overflow: scroll;
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
}
</style>