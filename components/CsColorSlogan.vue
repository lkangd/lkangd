<template>
  <div class="cs-color-slogan">
    <span
      class="cs-color-slogan__start-text"
      ref="startText"
      v-show="startText"
    >{{ startText }}</span>
    <span class="cs-color-slogan__placeholder">{{ placeholder }}</span>
    <span
      class="cs-color-slogan__wrapper"
      ref="csColorSlogan"
    >
      &nbsp;
      <span ref="showText"></span>
    </span>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'cs-color-slogan',
  props: {
    startText: {
      default: 'Work With ',
    },
    movingTexts: {
      type: Array,
      default() {
        return [
          'Front-End.',
          'JavaScript.',
          'HTML & CSS.',
          'Vue.js.',
          'Nuxt.js.',
          'React.',
          'Webpack.',
          'TypeScript.',
          'Node.js.',
          'Design.',
          'Passion & Love♥.',
        ];
      },
    },
    textChangeInterval: {
      type: Number,
      default: 2000,
    },
    movingElementCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      movingElements: [],
      movingEvent: null,
      colorTimer: null,
      placeholder: '',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.csColorSlogan.appendChild(this._createMovingElements());
      const { width } = this.$refs.startText.getBoundingClientRect();
      this.$refs.csColorSlogan.style.left = `${width}px`;
      this._makeColor();
      this.movingEvent = new Event('start-moving');
      this.$refs.csColorSlogan.addEventListener('start-moving', this._startMoving());
      this.$refs.csColorSlogan.dispatchEvent(this.movingEvent);
    },
    _createMovingElements() {
      const fragment = document.createDocumentFragment();
      this.movingElements = [];

      for (let i = 0; i < this.movingElementCount; i++) {
        const movingElement = document.createElement('span');
        this.movingElements.push(movingElement);
        fragment.appendChild(movingElement);
      }

      return fragment;
    },
    _startMoving() {
      let movingCount = -1;
      const { length } = this.movingTexts;
      return () => {
        movingCount += 1;
        movingCount %= length;
        this.placeholder = this.movingTexts[movingCount];
        this._accumulateText(this.movingTexts[movingCount]);
      };
    },
    _accumulateText(movingText) {
      let count = 0;
      const movingTextLength = movingText.length;
      const duration = setInterval(() => {
        if (!this.$refs.showText) {
          clearInterval(duration);
          clearInterval(this.colorTimer);
          return;
        }
        if (count === movingTextLength) {
          clearInterval(duration);
          clearInterval(this.colorTimer);
          setTimeout(() => {
            this._cutText(movingText);
            this._makeColor();
          }, this.textChangeInterval);
          return;
        }
        this.$refs.showText.textContent += movingText[count++];
        let movingElementShowLength = movingTextLength - this.$refs.showText.textContent.length;
        if (movingElementShowLength > this.movingElementCount) {
          movingElementShowLength = this.movingElementCount;
        }
        this.movingElements.slice(movingElementShowLength).forEach(item => {
          item.style.display = 'none';
        });
      }, 100);
    },
    _cutText(movingText) {
      let count = movingText.length;
      const movingTextLength = movingText.length;
      const duration = setInterval(() => {
        if (!this.$refs.showText) {
          clearInterval(duration);
          clearInterval(this.colorTimer);
          return;
        }
        if (count === -1) {
          clearInterval(duration);
          this.$refs.csColorSlogan.dispatchEvent(this.movingEvent);
          return;
        }
        let movingElementShowLength = movingTextLength - count;
        this.$refs.showText.textContent = this.$refs.showText.textContent.substr(0, count--);
        if (movingElementShowLength > this.movingElementCount) {
          movingElementShowLength = this.movingElementCount;
        }
        this.movingElements.slice(0, movingElementShowLength).forEach(item => {
          item.style.display = 'inline';
        });
      }, 100);
    },
    _makeColor() {
      this.colorTimer = setInterval(() => {
        this.movingElements.forEach(movingElement => {
          movingElement.style.color = this._randomColor();
          movingElement.textContent = this._randomText();
        });
      }, 100);
    },
    _randomColor() {
      const randomCode = (Math.random() * 0xffffff) << 0;
      return `#${randomCode.toString(16)}`;
    },
    _randomText() {
      const randomCode = Math.floor(Math.random() * (126 - 33)) + 33;
      return String.fromCharCode(randomCode);
    },
  },
};
</script>

<style scoped lang="scss">
@include B(color-slogan) {
  display: inline-block;
  position: relative;
  font-family: 'Merriweather', 'Georgia', serif;
  color: var(--text-normal);
  background-color: transparent;
  @include e(placeholder) {
    opacity: 0;
  }
  @include e(wrapper) {
    position: absolute;
    top: 0;
    white-space: nowrap;
  }
}
</style>