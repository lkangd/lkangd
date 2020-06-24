<template>
  <footer
    class="cs-footer"
    ref="footer"
  >
    <div class="cs-footer__wrapper">
      <nuxt-link to="/about">About</nuxt-link>•
      <nuxt-link to="/tech">Tech</nuxt-link>•
      <nuxt-link to="/think">Think</nuxt-link>•
      <nuxt-link to="/fun">Fun</nuxt-link>•
      <a
        href="/feed.xml"
        target="_blank"
      >RSS</a>•
      <a
        href="/sitemap.xml"
        target="_blank"
      >Sitemap</a>
      <div
        class="cs-footer__bottom"
        @click="$route.path === '/' ? '' : $router.replace('/')"
      >
        <svg-icon
          class="cs-footer__logo"
          name="logo"
        />
        2017-{{ new Date().getFullYear() }}&nbsp;
        Curtis' Spot
        &nbsp;
        •
        &nbsp;
        <cs-color-slogan />
      </div>
    </div>
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

<style scoped lang="scss">
@include B(footer) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;

  @include e(wrapper) {
    margin: 50px auto 0;
    padding: 28px 21px;
    max-width: $container-fixed;
    font-family: 'Merriweather', 'Georgia', serif;
    font-size: 14px;
    cursor: pointer;
    > a {
      margin-right: 5px;
      color: var(--main);
      box-shadow: 0 1px 0 0 currentColor;
    }
  }
  @include e(bottom) {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  @include e(logo) {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
}
</style>