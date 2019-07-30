<template lang="html">
  <div id="grid" @scroll="loadMoreImages" class="c-grid" ref="grid">
    <div class="c-grid__container" ref="grid_container">
      <div v-for="(slide, index) in shared.slides" class="o-thumb" :key="index" :data-image="slide" :data-index="index"
      v-lazyload="'js-lazyload'">
        <div
          class="o-thumb__image js-lazyload"
          :data-url="shared.imagesUrl + slide"
        >
        </div>
        <input type="checkbox" class="o-thumb__command o-thumb__command--select" @change="toggleSelectedImage" />
        <a href="#" @click="downloadSingleImage" class="o-thumb__command o-thumb__command--download"></a>
        <a href="#" @click="openAndScrollCarousel" class="o-thumb__command o-thumb__command--show"></a>
      </div>
    </div>
    <span :class="['c-grid__loader', { 'is-active': self.busy }]"></span>
  </div>
</template>

<script>
export default {
  name: 'grid',
  data: function() {
    return {
      shared: this.$storage.state,
      self: {
        busy: false,
        maxBox: 12,
        gap: 100,
        currentChunk: 0,
        loadedSlides: this.$storage.state.slides.slice(0, 18)
      }
    };
  },
  watch: {
    'self.busy': function(status) {
      if (status === true) {
        this.$storage.loadSlides(this.shared.slides.length);
      }
    },
    'shared.slides': function(currSlides, prevSlides) {
      this.self.busy = false;

      // eslint-disable-next-line no-console
      console.log(currSlides.length);
      // eslint-disable-next-line no-console
      console.log(prevSlides.length);
    }
  },
  methods: {
    loadMoreImages: function() {
      if (this.self.busy === false) {
        let gridScroll = parseInt(this.$refs.grid.scrollTop);
        let gridHeight = parseInt(this.$refs.grid.offsetHeight);
        let gridContainerHeight = parseInt(this.$refs.grid_container.offsetHeight);

        let gridOffset = gridScroll + gridHeight + this.self.gap;

        if (gridOffset >= gridContainerHeight) {
          this.self.busy = true;
        }
      }
    },
    downloadSingleImage: function(event) {
      event.preventDefault();

      let self = event.target;
      let thumb = self.parentElement;

      this.$storage.downloadSingleImage(thumb.dataset.image);
    },
    toggleSelectedImage: function(event) {
      event.preventDefault();

      let self = event.target;
      let thumb = self.parentElement;
      let thumbImage = thumb.dataset.image;

      this.$storage.toggleValueFromSelected(thumbImage);
    },
    openAndScrollCarousel: function(event) {
      event.preventDefault();

      let self = event.target;
      let thumb = self.parentElement;
      let thumbIndex = thumb.dataset.index;

      this.$storage.changeSlide(thumbIndex);
    }
  },
};
</script>

<style lang="scss">
.c-grid {
  z-index: 15;
  position: relative;

  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 100vh;
}

.c-grid .c-grid__container {
  padding-top: 2.5%;
  padding-left: 7.5%;
  padding-right: 7.5%;
  padding-bottom: 100px;

  box-sizing: border-box;
}

@media (min-width: 768px) {
  .c-grid .c-grid__container {
    padding-left: 2.5%;
    padding-right: 2.5%;
  }
}

.o-thumb {
  width: 100%;
  height: auto;
  display: inline-block;

  position: relative;

  padding-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
  padding-bottom: 6px;

  box-sizing: border-box;
}

.o-thumb__image {
  width: 100%;

  padding-top: 56.25%;

  border-width: 2px;
  border-style: solid;
  border-color: #27ae61;

  box-sizing: border-box;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.o-thumb__command {
  top: auto;
  left: auto;
  right: 6px;
  bottom: 6px;
  position: absolute;

  width: 32px;
  height: 32px;
  display: block;

  border-width: 2px;
  border-style: solid;
  border-color: #27ae61;

  background-color: #323232;

  color: #27ae61;

  opacity: 1;

  appearance: none;

  cursor: pointer;

  box-sizing: border-box;

  transition-duration: 300ms;
  transition-property: opacity;
  transition-timing-function: ease-in-out;
}

.o-thumb__command:after {
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  position: absolute;

  content: "";

  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center center;

  transition-duration: 300ms;
  transition-property: opacity;
  transition-timing-function: ease-in-out;
}

.o-thumb__command:hover:after {
  opacity: 0.6;
}

.o-thumb__command.o-thumb__command--select {
  left: 6px;
}

.o-thumb__command.o-thumb__command--select:after {
  opacity: 0;

  background-image: url('http://localhost:8000/assets/images/check.svg');
}

.o-thumb__command.o-thumb__command--select:checked:after {
  opacity: 1;
}

.o-thumb__command.o-thumb__command--download {
  right: 6px;
}

.o-thumb__command.o-thumb__command--download:after {
  background-image: url('http://localhost:8000/assets/images/download.svg');
}

.o-thumb__command.o-thumb__command--show {
  right: 40px;
}

.o-thumb__command.o-thumb__command--show:after {
  background-image: url('http://localhost:8000/assets/images/view.svg');
}

@media (min-width: 768px) {
  .o-thumb {
    width: 50%;
  }
}

@media (min-width: 1024px) {
  .o-thumb {
    width: 33.333%;
  }
}

.c-grid__loader {
  top: auto;
  left: 50%;
  right: auto;
  bottom: auto;
  position: absolute;

  width: 60px;
  height: 60px;
  display: block;

  opacity: 0;

  background-size: auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url('http://localhost:8000/assets/images/loading.gif');

  transition-duration: 300ms;
  transition-property: opacity;
  transition-timing-function: ease-in-out;

  transform: translate(-50%, -100px);
}

.c-grid__loader.is-active {
  opacity: 1;
}

.o-slide[lazy="loading"],
.o-thumb[lazy="loading"],
.o-thumb__image[lazy="loading"] {
  background-size: auto;
}
</style>
