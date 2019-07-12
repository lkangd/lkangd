<template>
  <nav class="cs-nav">
    <div
      :key="index"
      @click="$router.push(nav.path)"
      class="cs-nav__item"
      v-for="(nav, index) in navs"
    >
      <nuxt-link
        :to="nav.path"
        class="cs-nav-link"
        replace
      >{{ nav.text }}</nuxt-link>
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
  text-align: center;
  &__item {
    display: inline-block;
    padding: 0 8px;
    color: #343d46;
    cursor: pointer;
    > a {
      line-height: 1.4;
    }
  }
}
</style>