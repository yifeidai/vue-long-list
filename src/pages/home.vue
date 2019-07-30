<template>
  <div class="home">
    <div>vue long list</div>

    <List :list="list" :height="800" :itemHeight="40">
      <template v-slot:default="{ item }">
        <div class="list-item">
          <div>{{ item.id }}</div>
          <div>{{ item.title }}</div>
        </div>
      </template>
    </List>
  </div>
</template>

<script>
import List from "../components/list.vue"

export default {
  name: 'home',

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
    List,
  },
}
</script>

<style lang="stylus">
.list-item
  border: 1px solid red
  box-sizing: border-box
  height: 40px
</style>
