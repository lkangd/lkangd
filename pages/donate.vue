<template>
  <section class="donate cs-container">
    <h2 class="cs-title">本博客的赞助渠道</h2>
    <p class="cs-date">{{ new Date() | formatDate('DD, MMM, YYYY') }}</p>
    <p class="cs-text">你可以通过以下几种赞助渠道表达对我的支持，支持我不断地更新下去：</p>
    <ul class="cs-list">
      <li class="cs-list__item">通过支付宝 lkangd@foxmail.com</li>
      <li class="cs-list__item">通过微信赞赏码(见下方)</li>
    </ul>
    <p class="cs-text">当然，不捐款你也不会失去什么。你还是可以读到我的所有博客内容。</p>
    <p class="cs-text">感谢通过各种渠道捐赠过我的所有人。</p>
    <cs-statement />
  </section>
</template>

<script>
/* eslint-disable no-console */
import CsStatement from '@/components/CsStatement';
import appConfig from '@/config/app.config';

export default {
  name: 'donate',
  head() {
    return {
      title: `Donate - ${appConfig.meta.title}`,
    };
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: { CsStatement },
};
</script>

<style scoped lang="less">
.donate {
  .cs-text {
    margin: 32px 0;
  }
}
</style>