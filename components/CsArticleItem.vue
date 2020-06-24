<template>
  <article class="cs-article-item">
    <nuxt-link :to="article.link">{{ article.title }}</nuxt-link>
    <p
      class="cs-article-item__info"
    >{{ article.date | formatDate('MMM DD, YYYY') }}&nbsp;•&nbsp;{{ article.wordcount }} words&nbsp;•&nbsp;{{ article.min2read }}</p>
    <p class="cs-article-item__spoiler">{{ article.spoiler }}</p>
  </article>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-article-item',
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped lang="scss">
@include B(article-item) {
  margin-bottom: 60px;
  > a {
    display: block;
    margin-bottom: 7px;
    font-family: Montserrat, serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--main);
    box-shadow: none;
  }
  @include e(info) {
    margin: 0;
    line-height: 2;
    font-size: 14px;
    font-family: 'Merriweather', 'Georgia', serif;
    word-spacing: 2px;
  }
  @include e(spoiler) {
    line-height: 2;
    font-family: 'Merriweather', 'Georgia', serif;
  }
}
</style>