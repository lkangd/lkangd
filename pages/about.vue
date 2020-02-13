<template>
  <section class="about cs-container">
    <h2 class="cs-title">Self-introduction</h2>
    <p
      class="cs-text"
    >My name is Curtis Liong (梁康达). I was born in 1992 and started programming {{ new Date().getFullYear() - new Date(2016, 3, 1).getFullYear() }} years ago. I used to be an operation and maintenance engineer, but now I focus on JavaScript and wanna create something cool.</p>
    <h2 class="cs-title">
      The Principles Of Life That I Follow
      <sup>1</sup>
    </h2>
    <ul class="cs-list">
      <li
        :key="index"
        class="cs-list__item cs-text"
        v-for="(principle, index) in principles"
      >{{ principle }}</li>
    </ul>
    <h2 class="cs-title">Hobby</h2>
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
      </li>
    </ul>
    <p class="cs-text">
      <small>[1] 康德在《实用人类学》中对“人是什么”作答: “人具有一种自己创造自己的特性。”，在复杂多变的环境和人际关系中总结并奉行良好的原则有助于创造独特且向完美不断趋近的自我。</small>
    </p>
  </section>
</template>

<script>
/* eslint-disable no-console */
import appConfig from '@/config/app.config';

export default {
  name: 'about',
  head() {
    return {
      title: `About - ${appConfig.meta.title}`,
    };
  },
  data() {
    return {
      principles: [
        '自尊、尊重他人。',
        '笃信「自助者天助之」。',
        '当断立断，奉行「断舍离」。',
        '凡所有事，未知全貌，不予置评。',
        '不作出为获取关注而违心的表达。',
        '终身学习。',
      ],
      hobbies: [
        {
          text: '🎸Guitar',
          link: '',
        },
        {
          text: '📚Reading',
          link: 'https://book.douban.com/people/204029818/do',
        },
        {
          text: '☕️Coffee',
          link: '',
        },
        {
          text: '🏃Running',
          link: '',
        },
      ],
    };
  },
};
</script>