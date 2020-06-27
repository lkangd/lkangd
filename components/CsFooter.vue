<template>
  <footer
    class="cs-footer"
    ref="footer"
  >
    <div class="cs-footer__wrapper">
      <nuxt-link
        class="fl"
        to="/about"
      >About</nuxt-link>
      <span class="fl">•&nbsp;</span>
      <nuxt-link
        class="fl"
        to="/tech"
      >Tech</nuxt-link>
      <span class="fl">•&nbsp;</span>
      <nuxt-link
        class="fl"
        to="/think"
      >Think</nuxt-link>
      <span class="fl">•&nbsp;</span>
      <nuxt-link
        class="fl"
        to="/fun"
      >Fun</nuxt-link>
      <a
        class="fr"
        href="/sitemap.xml"
        target="_blank"
      >Sitemap</a>
      <span class="fr">•&nbsp;</span>
      <a
        class="fr"
        href="/feed.xml"
        target="_blank"
      >RSS</a>
      <div
        class="cs-footer__bottom"
        @click="$route.path === '/' ? '' : $router.replace('/')"
      >
        <svg-icon
          class="cs-footer__logo"
          name="logo"
        />
        2017-{{ new Date().getFullYear() }}&nbsp;Curtis' Spot
        <span style="margin: 0 5px;">•</span>
        <cs-color-slogan class="cs-footer__slogan" />
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
    @media (max-width: 500px) {
      text-align: center;
    }
  }
  @include e(bottom) {
    display: flex;
    align-items: center;
    margin-top: 40px;
    overflow: hidden;
  }
  @include e(logo) {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
  @include e(slogan) {
    @media (max-width: 500px) {
      ::v-deep {
        .cs-color-slogan__start-text {
          display: none;
        }
      }
    }
  }
}
</style>