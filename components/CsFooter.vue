<template>
  <footer class="cs-footer">
    <cs-color-slogan class="cs-footer__slogan" />
    <svg-icon
      class="cs-footer__logo"
      name="logo"
    />
    <p class="cs-footer__text">
      2017-{{ new Date().getFullYear() }}&nbsp;
      <a
        class="cs-outside-link"
        href="/"
        target="_blank"
      >Curtis' Spot</a>
      <!-- - Powered by
      <a
        class="cs-outside-link"
        href="https://nuxtjs.org/"
        target="_blank"
      >Nuxt.js</a>-->
    </p>
  </footer>
</template>

<script>
/* eslint-disable no-console */
import CsColorSlogan from '@/components/CsColorSlogan';

export default {
  name: 'cs-footer',
  components: { CsColorSlogan },
};
</script>

<style scoped lang="less">
.cs-footer {
  position: relative;
  margin-top: 40px;
  padding: 40px;
  padding-bottom: 20px;
  color: #9aa0ac;
  text-align: center;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;
    background-color: #fafafa;
  }
  &__logo {
    display: block;
    margin: 18px auto;
    width: 28px;
    height: 28px;
    color: #000;
  }
  &__text,
  &__text > a {
    font-weight: 600;
  }
  &__text {
    margin: 18px 0;
  }
  &__slogan {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    color: black;
  }
}
</style>