<template>
<div class="list">
  <div
    v-for="item in renderList"
    class="render-list"
  >
    <slot v-bind:item="item"></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
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
    }
  },

  created() {
    this.renderList = this.list
  },
}
</script>

<style lang="stylus">
.list
  border: 1px solid black
</style>
