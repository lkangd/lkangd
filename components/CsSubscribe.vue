<template>
  <form
    action="https://app.convertkit.com/forms/1488259/subscriptions"
    class="cs-subscribe cs-container"
    method="post"
    data-sv-form="1488259"
    data-uid="51a87aa3a3"
    data-format="inline"
    data-version="5"
    min-width="400 500 600 700"
  >
    <div class="cs-subscribe__wrapper">
      <h3 class="cs-subscribe__title">订阅本博客的最新内容</h3>
      <p class="cs-subscribe__describe">如果我有新的想法，会第一时间通过邮件与你分享.</p>
      <svg-icon
        class="cs-subscribe__icon"
        name="icon-e-mail"
      />
    </div>
    <div class="cs-subscribe__wrapper">
      <input
        type="text"
        class="cs-subscribe__input"
        aria-label="Your first name"
        name="fields[first_name]"
        placeholder="你的昵称"
        required
      />
      <input
        type="email"
        class="cs-subscribe__input"
        name="email_address"
        aria-label="Your email address"
        placeholder="你的邮件地址"
        required
      />
      <button
        data-element="submit"
        class="cs-subscribe__submit-btn"
      >
        <span>立即订阅</span>
      </button>
      <p class="cs-subscribe__tips">请放心我不会发送任何辣鸡邮件给你.</p>
      <p class="cs-subscribe__tips">
        你可以
        <em>随时</em> 取消订阅.
      </p>
    </div>
  </form>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-subscribe',
};
</script>

<style scoped lang="scss">
@include B(subscribe) {
  display: flex;
  align-items: top;
  margin: 40px auto;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, '\5FAE\8F6F\96C5\9ED1', helvetica neue, helvetica,
    ubuntu, roboto, noto, segoe ui, Arial, sans-serif;
  background-color: var(--bg);
  box-shadow: var(--form-shadow);
  border-radius: 6px;
  overflow: hidden;
  @media (max-width: 500px) {
    flex-direction: column;
  }
  @include e(wrapper) {
    flex: 1;
    padding: 40px;
    background-color: var(--bg);
    @include pseudo(first-child) {
      background-color: var(--bg-secondary);
    }
  }
  @include e(title) {
    margin-bottom: 20px;
    line-height: 1.2;
    font-size: 20px;
    font-weight: bold;
  }
  @include e(describe) {
    line-height: 1.8;
    font-size: 14px;
    font-weight: 400;
  }
  @include e(icon) {
    margin-top: 20px;
    width: 46px;
    height: 46px;
  }
  @include e(input) {
    display: block;
    padding: 12px;
    width: 100%;
    background-color: #fff;
    border: 1px solid rgb(227, 227, 227);
    border-radius: 4px;
    & + & {
      margin-top: 10px;
    }
    &::placeholder {
      color: #bdbdbd;
    }
  }
  @include e(submit-btn) {
    margin: 14px 0;
    padding: 12px 24px;
    color: #fff;
    border-radius: 500px;
    background-color: var(--main);
    > span {
      font-weight: bold;
    }
  }
  @include e(tips) {
    // margin-top: 14px;
    line-height: 2;
    font-size: 12px;
  }
}
</style>