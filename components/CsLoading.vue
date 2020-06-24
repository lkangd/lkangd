<template>
  <div
    class="cs-loading"
    ref="csLoading"
    v-if="loading"
  >
    <div
      class="main out-of-window"
      ref="main"
    >
      <div class="line line1"></div>
      <div class="line line1-2"></div>
      <div class="line line2"></div>
      <div class="line line2-2"></div>
      <div class="line line3"></div>
      <div class="line line3-2"></div>
      <div class="line line4"></div>
      <div class="line line4-2"></div>
      <div class="line line4-3"></div>
      <div class="line line5"></div>
      <div class="line line6"></div>
      <div class="line line7"></div>
      <div class="line line8"></div>
      <div class="line line8-1"></div>
      <div class="line line9"></div>
      <div class="line line10"></div>
      <p
        class="text"
        ref="text"
      >loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      bodySmoothBehavior: '',
    };
  },
  methods: {
    async start() {
      await this._normalizeScrollBehavior();
      this.loading = true;
      setTimeout(() => {
        this.$refs.main && this.$refs.main.classList.remove('out-of-window');
      }, 100);
    },
    async finish() {
      // if (!this.loading) return;

      setTimeout(() => {
        this.$refs.csLoading && this.$refs.csLoading.classList.add('loaded');
        setTimeout(() => {
          this.$refs.main.classList && this.$refs.main.classList.add('out-of-window');
          this.$refs.csLoading && this.$refs.csLoading.classList.remove('loaded');
          setTimeout(() => {
            this.loading = false;
            this._revertScrollBehavior();
          }, 50);
        }, 900);
      }, 900);
    },
    _normalizeScrollBehavior() {
      return new Promise(resolve => {
        const body = document.querySelector('body');
        this.bodySmoothBehavior = body.style.scrollBehavior;
        body.style.scrollBehavior = 'unset';
        this.$nextTick(resolve);
      });
    },
    _revertScrollBehavior() {
      const body = document.querySelector('body');
      body.style.scrollBehavior = this.bodySmoothBehavior;
    },
  },
};
</script>

<style lang="scss" scoped>
.cs-loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  will-change: opacity;
  transition: opacity 0.5s 0.4s;

  &.loaded {
    opacity: 0;
  }

  .main {
    position: absolute;
    top: calc(50% - 63px);
    left: calc(50% - 63px);
    z-index: 1;
    width: 126px;
    height: 126px;

    &.out-of-window {
      .line1,
      .line1-2,
      .line3,
      .line3-2,
      .line5,
      .line7,
      .line9 {
        transform: rotateZ(45deg) translateY(100vh);
      }

      .line2,
      .line2-2,
      .line4,
      .line4-2,
      .line4-3,
      .line6,
      .line8,
      .line8-1,
      .line10 {
        transform: rotateZ(45deg) translateY(-100vh);
      }

      .text {
        opacity: 0;
        transition: opacity 0.5s;
      }
    }

    .line {
      position: absolute;
      z-index: 3;
      width: 7px;
      background: var(--text-normal);
      will-change: transform;
      transform: rotateZ(45deg);

      &.line1 {
        top: 51px;
        left: 5px;
        height: 17px;
        transition: transform 0.5s;
      }

      &.line1-2 {
        top: -3px;
        left: 50px;
        height: 36px;
        transition: transform 0.5s;
      }

      &.line2 {
        top: 55px;
        left: 9px;
        height: 27px;
        transition: transform 0.5s;
      }

      &.line2-2 {
        top: -5px;
        left: 56px;
        height: 53px;
        transition: transform 0.5s;
      }

      &.line3 {
        top: 58px;
        left: 15px;
        height: 35px;
        transition: transform 0.5s 0.1s;
      }

      &.line3-2 {
        top: -2px;
        left: 63px;
        height: 59px;
        transition: transform 0.5s 0.1s;
      }

      &.line4 {
        top: 55px;
        left: 24px;
        height: 48px;
        transition: transform 0.5s 0.1s;
      }

      &.line4-2 {
        top: 27px;
        left: 60px;
        height: 33px;
        transition: transform 0.5s 0.1s;
      }

      &.line4-3 {
        top: 9px;
        left: 84px;
        height: 21px;
        transition: transform 0.5s 0.1s;
      }

      &.line5 {
        top: 4px;
        left: 54px;
        height: 117px;
        transition: transform 0.5s 0.2s;
      }

      &.line6 {
        top: 15px;
        left: 59px;
        height: 111px;
        transition: transform 0.5s 0.2s;
      }

      &.line7 {
        top: 16px;
        left: 69px;
        height: 115px;
        transition: transform 0.5s 0.3s;
      }

      &.line8 {
        top: 56px;
        left: 63px;
        height: 72px;
        transition: transform 0.5s 0.3s;
      }

      &.line8-1 {
        top: 30px;
        left: 116px;
        height: 18px;
        transition: transform 0.5s 0.3s;
      }

      &.line9 {
        top: 67px;
        left: 70px;
        height: 61px;
        transition: transform 0.5s 0.4s;
      }

      &.line10 {
        top: 82px;
        left: 78px;
        height: 40px;
        transition: transform 0.5s 0.4s;
      }
    }

    .text {
      position: absolute;
      bottom: -18%;
      left: 0;
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      color: var(--text-normal);
      text-align: center;
      will-change: opacity;
      transition: opacity 0.5s 0.5s;
    }
  }
}
</style>
