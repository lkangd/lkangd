<template>
  <nav class="cs-nav">
    <div
      :key="index"
      class="cs-nav__item"
      v-for="(nav, index) in navs"
    >
      <nuxt-link
        :to="nav.path"
        class="cs-nav-link"
        replace
      >{{ nav.text }}</nuxt-link>
    </div>
    <div class="cs-nav__item">
      <a
        class="cs-nav-link"
        href="/feed.xml"
        target="_blank"
      >RSS</a>
    </div>
    <div class="cs-nav__item">
      <a
        class="cs-nav-link"
        href="/sitemap.xml"
        target="_blank"
      >Sitemap</a>
    </div>
  </nav>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-nav',
  data() {
    return {
      navs: [
        {
          text: 'Home',
          path: '/',
        },
        {
          text: 'Tech',
          path: '/tech/',
        },
        {
          text: 'Think',
          path: '/think/',
        },
        {
          text: 'Fun',
          path: '/fun/',
        },
        {
          text: 'About',
          path: '/about/',
        },
        {
          text: 'Donate',
          path: '/donate/',
        },
      ],
    };
  },
};
</script>

<style scoped lang="less">
.cs-nav {
  padding: 32px;
  font-size: 0;
  text-align: center;
  &__item {
    display: inline-block;
    padding: 0 8px;
    color: var(--site-nav);
    cursor: pointer;
    > a {
      font-size: 16px;
      font-weight: bold;
      line-height: 1.4;
    }
  }
}
</style>