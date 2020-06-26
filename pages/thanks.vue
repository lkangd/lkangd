<template>
  <div class="cs-thanks cs-container">
    <h2 class="cs-thanks__title">Thank you for subscribing.</h2>
    <p class="cs-thanks__description cs-text">You are now confirmed.</p>
    <p class="cs-thanks__description cs-text">You can expect to receive emails as I create new content.</p>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-thanks',
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@include B(thanks) {
  @include e(title) {
    margin-top: 56px;
    line-height: 44px;
    font-size: 40px;
    font-family: 'Montserrat', serif;
    font-weight: 900;
    color: var(--main);
  }
  @include e(description) {
    margin-top: 20px;
  }
}
</style>