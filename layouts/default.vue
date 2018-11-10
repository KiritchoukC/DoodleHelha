<template>
  <div class="w-100">
    <my-header/>
    <div class="container body">
      <nuxt/>
    </div>
    <my-footer/>
  </div>
</template>

<script>
import MyFooter from '~/components/footer.vue'
import MyHeader from '~/components/header.vue'

export default {
  components: {
    MyFooter,
    MyHeader
  },
  mounted: function() {
    this.$socket.on('removed_from_group', group => {
      this.$toast.info(`Tu as été retiré du groupe ${group.name}`)
    })
    this.$socket.on('added_to_group', group => {
      this.$toast.info(`Tu as été ajouté au groupe ${group.name}`)
    })
  },
  beforeDestroy() {
    this.$socket.off('removed_from_group')
    this.$socket.off('added_to_group')
  }
}
</script>

<style>
.body {
  height: calc(100vh - 149px);
  max-height: calc(100vh - 149px);
  overflow: hidden;
}
</style>
