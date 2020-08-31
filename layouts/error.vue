<template>
  <cs-square />
</template>

<script>
import CsSquare from '@/components/CsSquare';

export default {
  name: 'cs-layout-error',
  props: ['error'],
  mounted() {
    console.error(`${this.error.statusCode}: ${this.error.message}`);
  },
  components: { CsSquare },
};
</script>