<template>
  <header class="cs-header">
    <cs-theme-toggle class="cs-header__toggle" />
    <h1 class="cs-header__title">
      <nuxt-link to="/">Curtis' Spot</nuxt-link>
      {{ ['tech', 'think', 'fun'].includes($route.name) && `/ ${$route.name}` || '' }}
    </h1>
    <div class="cs-header__wrapper">
      <svg-icon
        class="cs-header__logo"
        name="logo"
        @click="$route.path === '/' ? '' : $router.replace('/')"
      />
      <p class="cs-header__describe">
        Personal blog by
        <nuxt-link
          to="/about"
          replace
        >Curtis Liong</nuxt-link>.
        <br />Blogging about life, tech & everything I love in this world.
      </p>
    </div>
  </header>
</template>

<script>
/* eslint-disable no-console */
import CsThemeToggle from '@/components/CsThemeToggle';

export default {
  name: 'cs-header',
  components: { CsThemeToggle },
  methods: {
    toggleTheme() {
      const body = document.querySelector('body');

      body.style.transition = 'background-color 0.3s, color 0.3s';
      body.classList.toggle('light');
      body.classList.toggle('dark');
      localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    },
  },
};
</script>

<style scoped lang="scss">
@include B(header) {
  position: relative;
  margin: 0 auto;
  padding: 42px 21px 0;
  max-width: $container-fixed;
  @include e(toggle) {
    position: absolute;
    top: 46px;
    right: 21px;
  }
  @include e(title) {
    margin-bottom: 42px;
    font-family: Montserrat, sans-serif;
    font-size: 32px;
    font-weight: 900;
    > a {
      color: var(--text-title);
      box-shadow: none;
    }
  }
  @include e(logo) {
    margin-right: 14px;
    width: 56px;
    height: 56px;
    cursor: pointer;
  }
  @include e(wrapper) {
    display: flex;
    align-items: center;
    margin-bottom: 88px;
  }
  @include e(describe) {
    max-width: 420px;
    line-height: 1.5;
    font-family: 'Merriweather', 'Georgia', serif;
    > a {
      color: var(--main);
      box-shadow: 0 1px 0 0 currentColor;
    }
  }
}
</style>