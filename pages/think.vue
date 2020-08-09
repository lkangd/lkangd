<template>
  <section class="cs-container">
    <cs-article-item
      :article="post"
      v-for="(post, index) in postList"
      :key="index"
    />
  </section>
</template>

<script>
/* eslint-disable no-console */
import appConfig from '@/config/app.config';
import CsArticleItem from '@/components/CsArticleItem';

export default {
  name: 'cs-think',
  components: { CsArticleItem },
  head() {
    return {
      title: `Think - ${appConfig.meta.title}`,
    };
  },
  async asyncData({ $axios, route }) {
    return await $axios.$get(`http://localhost:8080/api${route.path}`);
  },
};
</script>