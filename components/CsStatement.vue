<template>
  <section class="cs-statement">
    <p class="cs-statement__text">
      讨论请发邮件到
      <a
        href="mailto:lkangd@gmail.com"
        target="_blank"
      >lkangd@gmail.com</a>
    </p>
    <p class="cs-statement__text">未经授权，禁止转载</p>
    <p class="cs-statement__text">通过支付宝 lkangd@foxmail.com 或赞赏码赞助此文</p>
    <img
      alt="reward-code"
      class="cs-statement__reward-code"
      src="~@/assets/images/wechat-reward-code.jpg"
    />
  </section>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-statement',
};
</script>

<style scoped lang="scss">
@include B(statement) {
  text-align: center;
  font-family: 'Noto Serif SC', Lusitana, serif;
  font-size: 14px;
  hr {
    margin: 64px 0;
    border: 0;
    border-bottom: 1px solid var(--hr);
  }
  @include e(text) {
    margin: 8px 0;
    line-height: 1.7;
    color: var(--text-normal);
  }
  @include e(reward-code) {
    margin-top: 50px;
    max-width: 30%;
    height: auto;
  }
  @media (max-width: 375px) {
    .cs-statement__reward-code {
      max-width: 76% !important;
    }
  }
}
</style>