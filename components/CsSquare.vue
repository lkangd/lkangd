<template>
  <div class="cs-square">
    <div
      class="cs-square__border"
      ref="border"
    ></div>
    <p class="cs-square__tab-name">{{ tabName }}</p>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  props: {
    tabName: {
      type: String,
      default: 'Not Found',
    },
  },
  mounted() {
    this.squareTrans = this._squareTrans.bind(this);
    this.$nextTick(() => {
      window.addEventListener('mousemove', this.squareTrans);
    });
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.squareTrans);
  },
  methods: {
    _squareTrans(event) {
      const middle = window.innerHeight / 2;
      const center = window.innerWidth / 2;
      const translateY = (event.clientX - center) / 80;
      const rotateX = (middle - event.clientY) / 40;
      const rotateY = (event.clientX - center) / 40;
      this.$refs.border.style.transform = `perspective(600px) translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
  },
};
</script>

<style lang="scss" scoped>
@include B(square) {
  $size: 280px;
  position: relative;
  width: 100%;
  min-height: $size + 100px;
  @include e(border) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 4;
    width: $size;
    height: $size;
    border: 20px solid var(--logo);
    box-sizing: border-box;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    will-change: transform;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @include e(tab-name) {
    $size: 100px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 5;
    width: 100%;
    height: $size;
    text-align: center;
    font-size: $size;
    line-height: $size;
    font-family: 'Montserrat', serif;
    color: #fff;
    text-shadow: 10px 20px 0 rgba(0, 0, 0, 0.05);
    user-select: none;
    cursor: default;
    @media (max-width: 700px) {
      font-size: $size * 0.7;
    }
  }
}
</style>
