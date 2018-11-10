<template>
  <header class="flex justify-between items-center w-full pl-3 pr-3">
    <h1>
      <nuxt-link
        to="/"
        class="text-black no-underline">
        <span class="text-primary">HEL</span>Ha Doodle
      </nuxt-link>
    </h1>
    <div class="flex justify-between items-center">
      <h4 class="border-b-2 border-primary mr-4">{{ username }}</h4>
      <button
        class="pl-3 pr-3 pt-2 pb-2 mt-2 mb-2 rounded font-semibold bg-white text-grey-dark no-outline"
        @click.prevent="logout">
        <font-awesome-icon
          icon="sign-out-alt" />
      </button>
    </div>
  </header>
</template>

<style scoped>
</style>


<script>
export default {
  data(app) {
    return {
      username: app.$auth.user ? app.$auth.user.email : ''
    }
  },
  methods: {
    logout() {
      this.$auth.logout().then(() => this.$toast.success('A bientôt !'))
    }
  }
}
</script>
