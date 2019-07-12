<template>
  <section class="fun cs-container">
    <h2 class="cs-title">记录触动过我的一些书影音和玩物</h2>
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
  name: 'fun',
  head() {
    return {
      title: `Fun - ${appConfig.meta.title}`,
    };
  },
  async asyncData({ $axios, $payloadURL, route, payload }) {
    if (process.static && process.client) {
      return await $axios.$get($payloadURL(route));
    }

    return { postList: (payload && payload.postList) || [] };
  },
};
</script>