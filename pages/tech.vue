<template>
  <section class="tech cs-container">
    <h2 class="cs-title">一起探索编码的世界</h2>
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
  name: 'tech',
  head() {
    return {
      title: `Tech - ${appConfig.meta.title}`,
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