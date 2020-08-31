<template>
  <div>
    <nuxt />
    <cs-footer />
  </div>
</template>

<script>
import CsFooter from '@/components/CsFooter';

export default {
  name: 'cs-layout-post',
  components: {
    CsFooter,
  },
};
</script>