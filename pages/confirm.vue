<template>
  <div class="cs-confirm cs-container">
    <h2 class="cs-confirm__title">Just one more thing...</h2>
    <p class="cs-confirm__description cs-text">Thank you for subscribing.</p>
    <p
      class="cs-confirm__description cs-text"
    >You will need to check your inbox and confirm your subscription.</p>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-confirm',
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@include B(confirm) {
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