<template lang="html">
  <div class="c-slide">
    <slot name="image"></slot>
    <div
      class="c-slide__content"
      v-if="this.$slots['title'] || this.$slots['text']"
    >
      <h1
        class="c-slide__content__title"
        v-if="this.$slots['title']"
      >
        <slot name="title"></slot>
      </h1>

      <div
        class="c-slide__content__text"
        v-if="this.$slots['text']"
      >
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'carousel-slide'
};
</script>

<style lang="scss" scoped>
.c-slide {
  width: 100%;
  height: 100%;
}

.c-slide__image {
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
