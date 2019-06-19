<template lang="html">
  <div id="grid">
    <!-- v-infinite-scroll="loadMoreBox" -->
    <div
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="true"
      infinite-scroll-listen-for-event=""
    >
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
    <span :class="[{ 'is-active': self.busy }, 'c-thumb__loader']"></span>
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
        currentChunk: 0,
        loadedSlides: this.$storage.state.slides.slice(0, 18)
      }
    };
  },
  methods: {
    loadMoreBox: function() {
      this.self.busy = true;
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
#carousel {
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 10;
  position: fixed;

  display: block;

  background-color: #323232;
  background-image: linear-gradient(#3d3d3d, #1a1a1a);

  opacity: 0;

  visibility: hidden;

  transition-duration: 500ms;
  transition-timing-function: ease-in-out;
  transition-property: z-index, opacity, visibility;
}

#carousel.is-active {
  z-index: 20;

  opacity: 1;

  visibility: visible;
}

#carousel > .c-carousel__handler {
  top: 50%;
  left: 2.5%;
  right: 2.5%;
  position: absolute;

  transform: translate(0px, -50%);
}

#carousel > .c-carousel__closer {
  top: 20px;
  left: auto;
  right: 20px;
  bottom: auto;
  z-index: 25;
  position: absolute;

  cursor: pointer;

  color: #323232;

  width: 48px;
  height: 48px;
  display: block;

  background-color: #27ae61;
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url('http://localhost:8000/assets/images/close.svg');

  border-radius: 50%;
}

.VueCarousel-slide {
  min-height: 95vh;
  position: relative;
}

.o-slide {
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  position: absolute;

  width: 100%;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

/******************************************************************************/

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

.c-thumb__loader {
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

  transform: translate(-50%, 0px);
}

.c-thumb__loader.is-active {
  opacity: 1;
}

.o-slide[lazy="loading"],
.o-thumb[lazy="loading"],
.o-thumb__image[lazy="loading"] {
  background-size: auto;
}
</style>
