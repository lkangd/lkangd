<template>
  <section class="think cs-container">
    <h2 class="cs-title">关于生活，工作和学习的一些胡思乱想</h2>
    <br />
    <ul class="post-list">
      <li
        :key="index"
        class="cs-text"
        v-for="(post, index) in postList"
      >
        <nuxt-link :to="post.link">{{ post.title }}</nuxt-link>
        ({{ post.date | formatDate('MMM DD, YYYY ')}})
      </li>
    </ul>
  </section>
</template>

<script>
/* eslint-disable no-console */
import appConfig from '@/config/app.config';

export default {
  name: 'think',
  head() {
    return {
      title: `Think - ${appConfig.meta.title}`,
    };
  },
  async asyncData({ $axios, $payloadURL, route, payload }) {
    if (process.static && process.client) {
      return await $axios.$get($payloadURL(route));
    } else {
      return await $axios.$get(`/api${route.path}`);
    }
  },
};
</script>
