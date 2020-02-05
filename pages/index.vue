<template>
  <section class="curtis-spot cs-container">
    <h2 class="cs-split-title">
      <span>ABOUT ME</span>
    </h2>
    <p
      class="cs-text"
    >My name is Curtis Liong (梁康达). I was born in 1992 and started programming {{ new Date().getFullYear() - new Date(2016, 3, 1).getFullYear() }} years ago. I used to be an operation and maintenance engineer, but now I focus on JavaScript and wanna create something cool.</p>
    <h2 class="cs-split-title">
      <span>FEATURED</span>
    </h2>
    <ul class="featured-list">
      <li
        :key="index"
        class="cs-text"
        v-for="(post, index) in featuredList"
      >
        <nuxt-link :to="post.link">{{ post.title }}</nuxt-link>
        ({{ post.date | formatDate('MMM DD, YYYY ')}})
      </li>
    </ul>
    <h2 class="cs-split-title">
      <span>POSTS</span>
    </h2>
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
    <h2 class="cs-split-title">
      <span>SKILLS</span>
    </h2>
    <ul class="skill-list">
      <li
        :key="index"
        class="cs-text"
        v-for="(skill, index) in skillList"
      >{{ skill }}</li>
    </ul>
    <h2 class="cs-split-title">
      <span>CONTACT</span>
    </h2>
    <ul class="contact-list">
      <li class="cs-text">
        <span>DOUBAN</span>
        :
        <a
          class="cs-outside-link"
          href="https://www.douban.com/people/204029818/"
          target="_blank"
        >吖侃</a>
      </li>
      <li class="cs-text">
        <span>GITHUB</span>
        :
        <a
          class="cs-outside-link"
          href="https://github.com/lkangd"
          target="_blank"
        >Curtis Liong</a>
      </li>
      <li class="cs-text">
        <span>E-MAIL</span>
        :
        <a
          class="cs-outside-link"
          href="mailto:lkangd@gmail.com"
          target="_blank"
        >lkangd@gmail.com</a>
      </li>
    </ul>
  </section>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'curtis-spot',
  async asyncData({ $axios, $payloadURL, route, payload }) {
    try {
      if (process.static && process.client) {
        return await $axios.$get($payloadURL(route));
      } else {
        return await $axios.$get(`/api${route.path}`);
      }
    } catch (e) {
      return { postList: (payload && payload.postList) || [], featuredList: (payload && payload.featuredList) || [] };
    }
  },
  data() {
    return {
      skillList: ['Fundamental HTML/CSS/ECMAScript(5/6/7)', 'Vue.js', 'Nuxt.js', 'React', 'Webpack', 'TypeScript', 'Wechat Relative', 'Git'],
    };
  },
};
</script>

<style scoped lang="less">
.curtis-spot {
  color: var(--text-normal);
  .contact-list {
    a {
      color: #343d46;
    }
  }
}
.dark {
  .contact-list {
    a {
      color: rgba(255, 255, 255, 0.88);
    }
  }
}
</style>