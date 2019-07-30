<template>
<div class="list" :style="{ height: height + 'px' }" @scroll="onScroll" ref="list">
  <div class="scroll-trigger" :style="{ height: scrollHeight + 'px' }"></div>
  <div :style="{transform: `translate3D(0, ${offset}px, 0)`}" class="render-wrap">
    <div
      v-for="item in renderList"
      class="render-list"
    >
      <slot v-bind:item="item"></slot>
    </div>
  </div>
</div>
</template>

<script>
const upSafeArea = 400
const downSageArea = 400

export default {
  props: {
    list: {
      type: Array,
      required: true,
    },

    height: {
      type: Number,
      default: 200,
    },

    itemHeight: {
      type: Number,
      requited: true,
    },
  },

  watch: {
    list() {
      this.renderList = this.list
    },
  },

  data() {
    return {
      renderList: [],
      scrollHeight: 0,
      start: 0,
      end: 0,
      offset: 0,
    }
  },

  lastScrollTop: 0,

  mounted() {
    this.renderList = this.list
    this.scrollHeight = this.renderList.length * this.itemHeight
    this.lastScrollTop = 0

    this.getRenderList()
  },

  methods: {
    onScroll(e) {
      this.debounceScroll(this.getRenderList)
    },

    debounceScroll(f) {
      let scrollTop = this.$refs.list.scrollTop
      if(Math.abs(scrollTop - this.lastScrollTop) >= this.itemHeight) {
        this.lastScrollTop = scrollTop
        f.call(this)
      }
    },

    getRenderList() {
      if(this.list.length === 0) return []

      const scrollTop = this.$refs.list.scrollTop

      if(scrollTop <= upSafeArea) {
        this.start = 0
        this.offset = 0
      } else {
        const startY = scrollTop - upSafeArea
        this.start = Math.ceil(startY / this.itemHeight) - 1
        this.offset = this.start * this.itemHeight
      }

      const endPos = scrollTop + this.height + downSageArea
      const end = Math.floor(endPos / this.itemHeight)
      if(end > this.list.length) {
        this.end = this.list.length - 1
      } else {
        this.end = end - 1
      }

      this.renderList = this.list.slice(this.start, this.end + 1)
    },
  },
}
</script>

<style lang="stylus">
.list
  border: 1px solid black
  overflow: auto
  position: relative

.render-wrap
  position: absolute
  top: 0
  left: 0
  right: 0
  will-change: transfrom
</style>
