<template>
  <div
    class="cs-theme-toggle"
    :class="{ 'is-dark': isDark }"
    @click="handleClick"
  >
    <img
      class="cs-theme-toggle__icon theme-ignore"
      src="~@/assets/images/moon.png"
    />
    <img
      class="cs-theme-toggle__icon theme-ignore"
      src="~@/assets/images/sun.png"
    />
    <button class="cs-theme-toggle__thumb"></button>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-theme-toggle',
  data() {
    return {
      isDark: true,
    };
  },
  mounted() {
    const body = document.querySelector('body');
    this.isDark = body.classList.contains('dark');
  },
  methods: {
    handleClick() {
      const body = document.querySelector('body');

      body.style.transition = 'background-color 0.3s, color 0.3s';
      body.classList.toggle('light');
      body.classList.toggle('dark');
      localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
      this.isDark = body.classList.contains('dark');
    },
  },
};
</script>

<style scoped lang="scss">
@include B(theme-toggle) {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  width: 50px;
  height: 24px;
  background-color: #0f1114;
  border-radius: 500px;
  cursor: pointer;
  @include e(icon) {
    width: 16px;
    height: 16px;
  }
  @include e(thumb) {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    // background-color: var(--main-convert);
    background-color: #fff;
    border-radius: 100%;
    transition: all 0.2s ease;
  }
  @include when(dark) {
    @include e(thumb) {
      transform: translateX(26px);
      box-shadow: 0 0 4px 2px var(--main);
    }
  }
}
</style>