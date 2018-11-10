<template>
  <div class="list-container w-100">
    <h2>This group's polls</h2>
    <div
      v-for="poll in polls"
      :key="poll._id"
      class="list-item six columns">
      <div class="u-pull-left">
        <h4>{{ poll.name }}</h4>
        <p class="black-40">{{ poll.description }}</p>
      </div>
      <nuxt-link
        :to="'/polls/'+ poll._id"
        class="button u-pull-right">
        <font-awesome-icon icon="arrow-right" />
      </nuxt-link>
    </div>
  </div>
</template>

<style scope>
</style>

<script>
export default {
  async asyncData(app) {
    let { data } = await app.$axios.get('/polls')
    return { polls: data }
  },
  head() {
    return {
      title: `Doodle - My polls`
    }
  }
}
</script>
