<template>
  <div v-if="!month || !selectedMonth">Loading...</div>
  <template v-else>
    <div class="myswipe">
      <button v-if="!isMobile" class="swipe-nav left" @click="previousPage">
        &lt;
      </button>
      <swiper
        :ref="swiperRef"
        :slides-per-view="1"
        :space-between="50"
        @swiper="onSwiper"
      >
        <swiper-slide>
          <SlideIntro :selected-month="selectedMonth" :month="month" />
        </swiper-slide>
        <swiper-slide>
          <SlideSongs :selected-month="selectedMonth" :month="month" />
        </swiper-slide>
        <swiper-slide>
          <SlideArtists :month="month" />
        </swiper-slide>
        <swiper-slide>
          <SlideAlbums :selected-month="selectedMonth" :month="month" />
        </swiper-slide>
        <swiper-slide>
          <SlideDays :month="month" />
        </swiper-slide>
        <swiper-slide>
          <SlidePlaylist
            :selected-month="selectedMonth"
            :top-songs="topSongs"
          />
        </swiper-slide>
        <swiper-slide>
          <div
            class="card"
            :style="`
              background-image: linear-gradient(
                  rgba(0, 0, 0, 0.75),
                  rgba(0, 0, 0, 0.75)
                ),
                url('${imgUrl}'); background-size: contain; background-repeat: no-repeat;`"
          >
            <div style="font-size: 8vh">Thanks for using Unwrapped!</div>
            <h2>
              I hope you like it. Feedback is always welcome, feel free to shoot
              me a Discord DM @ huntinator7#4680
            </h2>
            <h2 class="card-small">
              If you're rude, I will replace every song in your play history
              with Friday by Rebecca Black and you can't stop me
            </h2>
          </div>
        </swiper-slide>
      </swiper>
      <button v-if="!isMobile" class="swipe-nav right" @click="nextPage">
        >
      </button>
    </div>
    <button
      class="button alt"
      style="margin-top: 1rem"
      @click="unwrappedStore.clearMonth()"
    >
      Back
    </button>
  </template>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { useUnwrappedStore } from "@/stores/unwrapped";
import { storeToRefs } from "pinia";
import { ref, type Ref } from "vue";
import { useMedia } from "@/scripts/media";
import imgUrl from "@/assets/logo512.png";
import SlideIntro from "./slides/SlideIntro.vue";
import SlideSongs from "./slides/SlideSongs.vue";
import SlideArtists from "./slides/SlideArtists.vue";
import SlideAlbums from "./slides/SlideAlbums.vue";
import SlideDays from "./slides/SlideDays.vue";
import SlidePlaylist from "./slides/SlidePlaylist.vue";

const isMobile = useMedia("(max-width: 1024px)");

const unwrappedStore = useUnwrappedStore();
const { month, selectedMonth, topSongs } = storeToRefs(unwrappedStore);

const swiperRef: Ref<any> = ref(null);
function nextPage() {
  swiperRef.value.slideNext();
}
function previousPage() {
  swiperRef.value.slidePrev();
}
function onSwiper(swiper: any) {
  swiperRef.value = swiper;
}
</script>

<style lang="scss">
.card {
  width: 100%;
  display: grid;
  height: 100%;
  justify-items: center;
  align-items: center;
  text-align: center;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  color: var(--color-white-0);
  padding: 0rem 1rem;
  &.grid {
    grid-template-rows: 1.5fr 3fr 3fr 3fr 1fr;
    row-gap: 1.5rem;
  }
  > h1 {
    width: -webkit-fill-available;
    font-size: 3vh;
    font-weight: bold;
    margin-bottom: 0;
    background-color: var(--color-primary);
    color: var(--color-black-0);
  }
  h2 {
    font-size: 2vh;
    color: var(--color-white-1);
  }
  .card-large {
    font-size: 6vh;
    line-height: 8vh;
    position: relative;
    top: -0.5vh;
    color: var(--color-white-0);
  }
  .card-small {
    font-size: 1rem;
    color: #fff5;
  }
  .card-artist {
    font-size: 3vh;
  }
  .card-section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }
}
.myswipe {
  display: flex;
  height: 0;
  flex-grow: 1;
  width: -webkit-fill-available;
  background-color: var(--color-background);
}
.swipe-nav {
  padding: 8rem;
  height: 100%;
  background-color: var(--color-background);
  border: none;
  color: var(--color-text);
  font-size: 3rem;
  &.left {
    margin-right: 5px;
  }
  &.right {
    margin-left: 5px;
  }
  &:hover {
    cursor: pointer;
  }
}
.card-playlist {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(25, 32px);
  column-gap: 1rem;
  row-gap: 0.5rem;
  height: 50vh;
  overflow-y: auto;
}
.card-playlist-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  span {
    padding-left: 0.5rem;
    text-align: initial;
  }
}
</style>
