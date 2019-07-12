<template>
  <header class="cs-header">
    <svg-icon
      class="cs-header__logo"
      name="logo"
    />
    <p class="cs-header__text">Curtis Liong</p>
    <p class="cs-header__text cs-header__text--light">
      <a
        class="cs-outside-link"
        href="https://en.wikipedia.org/wiki/Front-end_web_development"
        target="_blank"
      >Front-end</a> Engineer. Blogging about life, tech & everything I love.
    </p>
  </header>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-header',
};
</script>

<style scoped lang="less">
.cs-header {
  padding-top: 64px;
  &__logo {
    position: relative;
    left: 4px;
    display: block;
    margin: 0 auto;
    width: 128px;
    height: 128px;
    color: #000;
    transition: color 0.5s;
    cursor: pointer;
    &:hover {
      color: rgba(255, 233, 87);
    }
  }
  &__text {
    margin: 16px 0;
    padding: 0 32px;
    font-weight: bold;
    line-height: 1.4;
    text-align: center;
    &--light {
      color: #65737e;
      font-weight: 500;
    }
  }
}
</style>