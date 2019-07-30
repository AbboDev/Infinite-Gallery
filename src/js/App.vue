<template>
  <main id="app">
    <grid v-if="$storage.state.slides.length == 0" />
    <div class="" v-else-if="errors.length > 0">
      {{ $storage.state.errors }}
    </div>
    <div class="" v-else>
      Loading...
    </div>
  </main>
</template>

<script>
import '../scss/app.scss';
import Grid from './components/Grid.vue';

export default {
  name: 'app',
  created() {
    this.$storage.loadSlides();
  },
  components: {
    Grid
  }
};
</script>

<style lang="scss">
body {
  overflow: hidden;
}
</style>
