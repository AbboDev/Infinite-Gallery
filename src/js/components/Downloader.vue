<template lang="html">
  <div id="downloader" :class="{ 'is-active': shared.selected.length }">
    <a href="#" @click="downloadedSelectedImages"></a>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      private: {},
      shared: this.$storage.state,
    };
  },
  methods: {
    downloadedSelectedImages: function(event) {
      event.preventDefault();

      for (var i = this.shared.selected.length - 1; i >= 0; i--) {
        this.$storage.downloadSingleImage(this.shared.selected[i]);
      }
      // store.downloadMultipleImages(this.shared.selected);
    }
  },
};
</script>

<style lang="scss" scoped>
#downloader {
  top: auto;
  left: auto;
  right: 20px;
  bottom: 20px;
  z-index: 16;
  position: fixed;

  color: #323232;

  width: 64px;
  height: 64px;
  display: block;

  opacity: 0;

  visibility: hidden;

  background-color: #27ae61;

  border-radius: 50%;

  transition-duration: 500ms;
  transition-timing-function: ease-in-out;
  transition-property: opacity, visibility;
}

#downloader.is-active {
  opacity: 1;

  visibility: visible;
}

#downloader a {
  width: 100%;
  height: 100%;
  display: block;

  background-size: 40px 40px;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url('http://localhost:8000/assets/images/download-multiple.svg');
}
</style>
