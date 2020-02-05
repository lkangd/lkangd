<template>
  <cs-square />
</template>

<script>
import CsSquare from '@/components/CsSquare';

export default {
  name: 'error',
  props: ['error'],
  components: { CsSquare },
};
</script>