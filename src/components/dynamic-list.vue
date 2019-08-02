<template>
<div class="dynamic-list" :style="{ height: height + 'px' }" @scroll="onScroll" ref="list">
  <div class="dynamic-scroll-trigger" :style="{ height: scrollHeight + 'px' }"></div>
  <div :style="{transform: `translate3D(0, ${offset}px, 0)`}" class="dynamic-render-wrap">
    <template v-for="(item, index) in renderList">
      <slot v-bind:item="item"></slot>
    </template>
  </div>

  <div :style="{ visibility: 'hidden' }" ref="testList">
    <template v-for="(item, index) in testHeightList">
      <slot v-bind:item="item" :ref="'test-' + index"></slot>
    </template>
  </div>
</div>
</template>

<script>
const safeAreaNum = 2
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

    estimateItemHeight: {
      type: Number,
      default: 30,
    },
  },

  data() {
    return {
      renderList: [],
      testHeightList: [],
      scrollHeight: 0,
      start: 0,
      end: 0,
      testStart: 0,
      testEnd: 0,
      offset: 0,
      heightCache: {},
      lastScrollTop: 0,
      isCalcing: false,
    }
  },

  mounted() {
    this.renderList = this.list
    this.scrollHeight = this.renderList.length * this.estimateItemHeight
    this.lastScrollTop = 0

    this.getRenderList()
  },

  methods: {
    onScroll(e) {
      this.debounceScroll(this.getRenderList)
    },

    debounceScroll(f) {
      const scrollTop = this.$refs.list.scrollTop
      const debounceLength = Math.min(this.getHeight(this.start), this.getHeight(this.end))
      if(Math.abs(scrollTop - this.lastScrollTop) > debounceLength) {
        f()
      }
    },

    getHeight(index) {
      return this.heightCache[index] == null ?
        this.estimateItemHeight : this.heightCache[index]
    },

    getRenderList() {
      if(this.isCalcing) return

      this.isCalcing = true

      if(this.list.length === 0) {
        this.isCalcing = false
        return []
      }

      this.testStart = this.getNewStart()
      this.testEnd = this.getNewEnd()
      this.testHeightList = this.list.slice(this.testStart, this.testEnd + 1)
      const lastScrollTop = this.$refs.list.scrollTop

      this.$nextTick(() => {
        // calc new offset
        if(this.testStart > this.start) {
          for(let i = this.start + 1; i <= this.testStart; i++) {
            this.offset += this.getHeight(i)
          }
        }

        if(this.testStart < this.start) {
          for(let i = this.start - 1; i >= this.testStart; i--) {
            this.offset -= this.getHeight(i)
          }
        }

        this.start = this.testStart
        this.end = this.testEnd
        this.renderList = this.list.slice(this.start, this.end + 1)
        this.lastScrollTop = lastScrollTop


        for(let i = this.testStart; i <= this.testEnd; i++) {
          const cache = this.heightCache[i]
          const realHeight = this.$refs.testList.children[i - this.testStart].offsetHeight
          if(cache !== realHeight) {
            this.scrollHeight += (realHeight - this.getHeight(i))
          }
          this.heightCache[i] = realHeight
        }

        this.$nextTick(() => {
          this.isCalcing = false

          if(this.getNewEnd() !== this.end) {
            this.getRenderList()
          }
        })
      })
    },

    getNewStart() {
      if(this.$refs.list.scrollTop <= this.getHeight(0) + this.getHeight(1)) {
        return 0
      }

      const offsetToVisibleTop = this.$refs.list.scrollTop - this.offset
      let unvisibleTopItemsHeight = 0
      let unvisibleTopCounter = this.start
      while(unvisibleTopItemsHeight <= offsetToVisibleTop) {
        unvisibleTopItemsHeight += this.getHeight(unvisibleTopCounter++)
      }

      return unvisibleTopCounter - 1 - safeAreaNum
    },

    getNewEnd() {
      const visibleEndPos = this.$refs.list.scrollTop + this.height

      let visibleEndIndex = this.start
      let heightSum = this.offset
      while(heightSum < visibleEndPos) {
        heightSum += this.getHeight(visibleEndIndex++)
      }

      const testEnd = visibleEndIndex - 1 + safeAreaNum
      if(testEnd >= this.list.length - 1) {
        return this.length
      } else {
        return testEnd
      }
    },
  },
}
</script>

<style lang="stylus">
.dynamic-list
  border: 1px solid black
  overflow: auto
  position: relative

.dynamic-render-wrap
  position: absolute
  top: 0
  left: 0
  right: 0
  will-change: transfrom
</style>
