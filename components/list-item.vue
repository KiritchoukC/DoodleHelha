<template>
  <div
    class="list__item flex justify-between items-center w-full mt-4 pointer grow"
    @click="goToDetails(item._id)">
    <div class="flex items-center pl-3">
      <div class="mb-2">
        <h3 class="mb-2">{{ item.name }}</h3>
        <p class="text-grey pl-1">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
      name: '',
      description: ''
    }
  },
  methods: {
    goToDetails(itemId) {
      this.$emit('goToDetails', itemId)
    },
    remove(item) {
      this.$emit('remove', item)
    }
  }
}
</script>
