<template>
<div>
  <div>DynamicList</div>

  <dynamic-list
    :list="list"
    :height="800"
    :estimateItemHeight="70"
  >
    <template v-slot:default="{ item }">
      <div class="list-item" :style="{ height: 45 + item.id % 10 + 'px' }">
        <div>{{ item.id }}</div>
        <div>{{ item.title }}</div>
      </div>
    </template>
  </dynamic-list>
</div>
</template>

<script>
import DynamicList from "../components/dynamic-list.vue"

export default {
  data() {
    return {
      list: [],
    }
  },

  created() {
    const num = 10000

    for(let i = 0; i < num; i++) {
      this.list.push({
        id: i,
        title: "message" + i,
      })
    }
  },

  components: {
    DynamicList,
  },
}
</script>

<style lang="stylus">
</style>
