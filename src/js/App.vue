<template>
  <main id="app">
    <grid v-if="$storage.state.slides.length == 0" />
    <div class="" v-else-if="errors.length > 0">
      {{ errors }}
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
  data: () => ({
    errors: []
  }),
  created() {
    this.$http.get(this.$storage.state.readerUrl)
      .then((response) => {
        this.$storage.state.slides = response.data;
      })
      .catch((error) => {
        this.errors.push(error);
      });
  },
  components: {
    Grid
  }
};
</script>

<style lang="scss" scoped>
#app {
  z-index: 15;
  position: relative;

  padding-top: 2.5%;
  padding-left: 7.5%;
  padding-right: 7.5%;
  padding-bottom: 100px;

  box-sizing: border-box;
}

@media (min-width: 768px) {
  #app {
    padding-left: 2.5%;
    padding-right: 2.5%;
  }
}
</style>
