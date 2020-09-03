<template>
  <section class="cs-about cs-container">
    <h2 class="cs-title">个人介绍</h2>
    <p
      class="cs-text"
    >My name is Curtis Liong (梁康达). I was born in 1992 and started programming {{ new Date().getFullYear() - new Date(2016, 3, 1).getFullYear() }} years ago. I used to be an operation and maintenance engineer, but now I focus on JavaScript and wanna create something cool.</p>
    <h2 class="cs-title">
      原则
      <sup>1</sup>
    </h2>
    <ul class="cs-list">
      <li
        :key="index"
        class="cs-list__item cs-text"
        v-for="(principle, index) in principles"
      >{{ principle }}</li>
    </ul>
    <h2 class="cs-title">兴趣爱好</h2>
    <ul class="cs-list">
      <li
        :key="index"
        class="cs-list__item cs-text"
        v-for="(hobby, index) in hobbies"
      >
        <a
          v-if="hobby.link"
          :href="hobby.link"
          target="_blank"
        >{{ hobby.text }}</a>
        <span v-else>{{ hobby.text }}</span>
        <template v-if="hobby.remarks">
          (
          <span
            class="cs-about__remark"
            v-for="(remark, index) in hobby.remarks"
            :key="index"
          >
            <span v-show="index !== 0">&nbsp;|</span>
            <a
              :href="remark.value"
              target="_blank"
            >{{ remark.key }}</a>
          </span>
          )
        </template>
      </li>
    </ul>
    <h2 class="cs-title">和我聊聊</h2>
    <p class="cs-text">我目前正在寻找新的工作机会，如果你对我有兴趣，可以和我聊聊。🖖</p>
    <ul class="cs-list">
      <li
        :key="index"
        class="cs-list__item cs-text"
        v-for="(contact, index) in contacts"
      >
        <a
          v-if="contact.link"
          :href="contact.link"
          target="_blank"
        >{{ contact.text }}</a>
        <span v-else>{{ contact.text }}</span>
        <template v-if="contact.remarks">
          (
          <span
            class="cs-about__remark"
            v-for="(remark, index) in contact.remarks"
            :key="index"
          >
            <span v-show="index !== 0">&nbsp;|</span>
            <a
              :href="remark.value"
              target="_blank"
            >{{ remark.key }}</a>
          </span>
          )
        </template>
      </li>
    </ul>
    <p class="cs-text" style="margin-top: 50px">
      <small>[1] 康德在《实用人类学》中对“人是什么”作答: “人具有一种自己创造自己的特性。”，在复杂多变的环境和人际关系中总结并奉行良好的原则有助于创造独特且向完美不断趋近的自我。</small>
    </p>
  </section>
</template>

<script>
/* eslint-disable no-console */
import appConfig from '@/config/app.config';

export default {
  name: 'cs-about',
  head() {
    return {
      title: `About - ${appConfig.meta.title}`,
    };
  },
  data() {
    return {
      principles: [
        '终身学习。',
        '自尊、尊重他人。',
        '笃信「自助者天助之」。',
        '当断立断，奉行「断舍离」。',
        '凡所有事，未知全貌，不予置评。',
        '不作违心的表达。',
      ],
      hobbies: [
        {
          text: '🎸 Guitar',
        },
        {
          text: '📚 Reading',
          remarks: [
            { key: '在读', value: 'https://book.douban.com/people/204029818/do' },
            { key: '读过', value: 'https://book.douban.com/people/204029818/collect' },
          ],
        },
        {
          text: '☕️ Coffee',
        },
        {
          text: '🏃 Running',
        },
      ],
      contacts: [
        {
          text: '💬 WeChat: lkangd',
        },
        {
          text: '✉️ E-mail: lkangd@gmail.com',
          remarks: [{ key: '发邮件', value: 'mailto:lkangd@gmail.com' }],
        },
        {
          text: '🤖 Github: github.com/lkangd',
          remarks: [{ key: '去看看', value: 'https://github.com/lkangd' }],
        },
      ],
    };
  },
};
</script>

<style lang="scss">
// @include B(about) {
//   @include e(remark) {
//     & + & {
//       margin-left: 5px;
//       @include pseudo(before) {
//         content: '|';
//       }
//     }
//   }
// }
</style>