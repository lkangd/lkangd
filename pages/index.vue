<template>
  <div class="cs-index cs-container">
    <cs-article-item
      :article="post"
      v-for="(post, index) in [...featuredList, ...postList]"
      :key="index"
    />
  </div>
</template>

<script>
/* eslint-disable no-console */
import CsArticleItem from '@/components/CsArticleItem';

export default {
  name: 'index',
  components: { CsArticleItem },
  async asyncData({ $axios, route }) {
    return await $axios.$get(`http://localhost:8080/api/`);
  },
  methods: {
    toggleTheme() {
      const body = document.querySelector('body');

      body.style.transition = 'background-color 0.3s, color 0.3s';
      body.classList.toggle('light');
      body.classList.toggle('dark');
      localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    },
  },
};
</script>

<style scoped lang="scss">
@include B(index) {
  padding: 0 21px;
  color: var(--text-normal);
}
</style>