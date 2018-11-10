<template>
  <form class="flex flex-col justify-center items-center w-full mt-1">
    <div class="flex flex-col justify-center col-12 col-sm-12 col-md-8 col-lg-6 mt-3">
      <label
        for="name"
        class="font-semibold">Le nom de ton groupe<span class="text-red float-right font-hairline text-xs">{{ errors.first('name') }}</span></label>
      <input
        v-validate="{required: true, min: 1, max: 50}"
        id ="name"
        ref="nameInput"
        v-model="name"
        type="text"
        name="name"
        class="w-full pl-2 pt-2 pb-2 mt-1 no-outline bg-grey-lightest rounded">
    </div>
    <div class="flex flex-col justify-center col-12 col-sm-12 col-md-8 col-lg-6 mt-3">
      <label
        for="description"
        class="font-semibold">Une petite description<span class="text-red float-right font-hairline text-xs">{{ errors.first('description') }}</span></label>
      <input
        v-validate="{required: true, min: 1, max: 100}"
        id ="description"
        v-model="description"
        type="text"
        name="description"
        class="w-full pl-2 pt-2 pb-2 mt-1 no-outline bg-grey-lightest rounded">
    </div>
    <div class="flex flex-col justify-center col-12 col-sm-12 col-md-8 col-lg-6 mt-3 mb-3">
      <button
        :class="{'bg-primary-light text-grey': isDisabled}"
        :disabled="isDisabled"
        type="submit"
        class="w-full pt-2 pb-2 mt-2 mb-2 rounded font-semibold bg-primary text-grey-lightest no-outline"
        @click.prevent="submit()">Créer le groupe</button>
    </div>
  </form>
</template>

<style scoped>
</style>

<script>
export default {
  data() {
    return {
      name: '',
      description: ''
    }
  },
  computed: {
    isDisabled() {
      return (
        this.errors.any() ||
        this.name.length === 0 ||
        this.description.length === 0
      )
    }
  },
  methods: {
    submit() {
      this.$emit('createGroup', {
        name: this.name,
        description: this.description
      })
    }
  }
}
</script>
