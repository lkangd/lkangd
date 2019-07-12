<template>
  <div>
    <cs-header />
    <cs-nav />
    <nuxt />
    <cs-footer />
  </div>
</template>

<script>
import CsHeader from '@/components/CsHeader';
import CsFooter from '@/components/CsFooter';
import CsNav from '@/components/CsNav';

export default {
  components: {
    CsHeader,
    CsFooter,
    CsNav,
  },
};
</script>