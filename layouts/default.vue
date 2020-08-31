<template>
  <div>
    <cs-header />
    <nuxt />
    <cs-footer />
  </div>
</template>

<script>
import CsHeader from '@/components/CsHeader';
import CsFooter from '@/components/CsFooter';

export default {
  name: 'cs-layout-default',
  components: {
    CsHeader,
    CsFooter,
  },
};
</script>