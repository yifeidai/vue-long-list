<template>
  <div class="home">
    <div>vue long list</div>

    <List :list="list">
      <template v-slot:default="{ item }">
        <div>
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
      list: [
        {
          id: 1,
          title: "hello1",
        },
        {
          id: 2,
          title: "hello2",
        },
        {
          id: 3,
          title: "hello3",
        },
        {
          id: 4,
          title: "hello4",
        },
        {
          id: 5,
          title: "hello5",
        },
        {
          id: 6,
          title: "hello6",
        },
      ],
    }
  },

  components: {
    List,
  },
}
</script>
