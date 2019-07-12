<template>
  <section class="cs-statement">
    <hr />
    <p class="cs-statement__text">
      讨论请发邮件到
      <a
        class="cs-outside-link"
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

<style scoped lang="less">
.cs-statement {
  text-align: center;
  hr {
    margin: 64px 0;
    border: 0;
    border-bottom: 1px solid #a7adba;
  }
  &__text {
    margin: 8px 0;
    line-height: 1.7;
    color: #65737e;
  }
  &__reward-code {
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