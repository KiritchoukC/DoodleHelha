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
