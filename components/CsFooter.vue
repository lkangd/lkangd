<template>
  <footer
    ref="footer"
    class="cs-footer"
  >
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
    </p>
  </footer>
</template>

<script>
/* eslint-disable no-console */
import CsColorSlogan from '@/components/CsColorSlogan';

export default {
  name: 'cs-footer',
  mounted() {
    // sticky footer
    const nuxt = document.getElementById('__nuxt');
    nuxt && (nuxt.style['padding-bottom'] = `${this.$refs.footer.offsetHeight}px`);
  },
  components: { CsColorSlogan },
};
</script>

<style>
#__nuxt {
  position: relative;
  min-height: 100%;
}
</style>

<style scoped lang="less">
.cs-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  margin-top: 40px;
  padding: 40px;
  padding-bottom: 20px;
  width: 100%;
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
    background-color: var(--footer-bg);
  }
  &__logo {
    display: block;
    margin: 18px auto;
    width: 28px;
    height: 28px;
    color: var(--logo);
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
  }
}
</style>