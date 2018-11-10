<template>
  <div class="overflow-hidden flex flex-col justify-center items-center w-full">
    <div class="flex justify-between items-center col-12 col-sm-12 col-md-8 col-lg-6 z-10">
      <h2>Mes groupes</h2>
      <button
        class="svg-btn leading-none no-outline"
        @click="toggleForm()">
        <svg
          :class="{'svg-rotate-start': !groupForm, 'svg-rotate-end': groupForm}"
          class="svg-icon"
          height="16"
          version="1.1"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64">
          <path
            fill="none"
            stroke="#000"
            stroke-width="5"
            d="m 32,4.962098 0,53.893986"
            transform="matrix(1,0,0,1,0,0)"/>
          <path
            fill="none"
            stroke="#000"
            stroke-width="5"
            d="m 5.1127494,31.909091 53.8342436,0"
            transform="matrix(1,0,0,1,0,0)"/>
        </svg>
      </button>
    </div>
    <group-form
      ref="groupFormEl"
      :style="formGroupStyles"
      @createGroup="onSubmit"/>
    <div
      ref="listContainerEl"
      :style="listContainerStyles"
      class="list__item__container overflow-y-auto w-full col-12 col-sm-12 col-md-8 col-lg-6">
      <list-item
        v-for="group in groups"
        :key="group._id"
        :item="group"
        @goToDetails="goToDetails"
        @remove="remove"/>
      <div
        v-if="loading"
        class="list__item flex justify-center items-center w-full mb-3"><loading/></div>
    </div>
  </div>
</template>

<style scope>
</style>

<script>
export default {
  async asyncData(app) {
    let { data, status, statusText } = await app.$axios
      .get('/groups')
      .catch(e => {
        app.$toast.simple('Error')
      })
    if (status !== 200) {
      app.$toast.error(statusText)
    }
    return {
      groups: data
    }
  },
  data() {
    return {
      listContainerStyles: {},
      loading: false,
      groupForm: false,
      groupFormHeight: 229,
      listContainerHeight: 0,
      formGroupStyles: {
        opacity: 0,
        transform: 'translateY(-229px)',
        marginBottom: '-219px',
        transition: 'transform ease-in-out 0.3s, opacity ease-in-out 0.3s'
      }
    }
  },
  beforeMount() {},
  mounted: function() {
    this.$socket.on('removed_from_group', group => {
      const groupIndex = this.groups.findIndex(g => g._id === group._id)
      this.groups.splice(groupIndex, 1)
    })
    this.$socket.on('added_to_group', group => {
      const groupIndex = this.groups.findIndex(g => g._id === group._id)
      if (groupIndex === -1) this.groups.push(group)
    })
    this.$nextTick().then(() => {
      this.listContainerStyles = {
        height: this.$refs.listContainerEl.offsetHeight,
        transition: 'margin-top ease-in-out 0.3s, height ease-in-out 0.3s'
      }
      this.listContainerHeight = this.listContainerStyles.height
    })
  },
  beforeDestroy() {
    this.$socket.off('removed_from_group')
    this.$socket.off('added_to_group')
  },
  head() {
    return {
      title: `Doodle - My Groups`
    }
  },
  methods: {
    toggleForm() {
      if (this.groupForm) {
        this.formGroupStyles.opacity = 0
        this.formGroupStyles.transform = `translateY(-${
          this.groupFormHeight
        }px)`
        this.listContainerStyles.marginTop = `0px`
        this.listContainerStyles.height =
          this.listContainerHeight + this.groupFormHeight + 'px'
      } else {
        this.formGroupStyles.opacity = 1
        this.formGroupStyles.transform = `translateY(0px)`
        this.listContainerStyles.marginTop = `${this.groupFormHeight}px`
        this.listContainerStyles.height =
          this.listContainerHeight - this.groupFormHeight + 'px'
      }

      this.groupForm = !this.groupForm
    },
    onSubmit(groupForm) {
      this.toggleForm()
      this.loading = true
      const newGroup = {
        name: groupForm.name,
        description: groupForm.description
      }
      this.$axios
        .post('/groups', newGroup)
        .then(result => {
          this.loading = false
          this.groups.push(result.data)
        })
        .catch(err => console.error(err))
    },
    remove(group) {
      this.$snotify.confirm(
        `Es-tu certain(e) de vouloir supprimer le groupe ${group.name}`,
        `Suppression ${group.name}`,
        {
          timeout: 10000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          type: 'warning',
          backdrop: 0.2,
          position: 'centerCenter',
          buttons: [
            {
              text: 'Oui',
              action: toast => {
                this.$axios
                  .delete('/groups/' + group._id)
                  .then(result => {
                    this.$snotify.remove(toast.id)
                    this.groups.splice(this.groups.indexOf(group), 1)
                  })
                  .catch(err => {
                    this.$snotify.remove(toast.id)
                    this.$snotify.danger(err)
                  })
              }
            },
            {
              text: 'Nope',
              action: toast => {
                this.$snotify.remove(toast.id)
              }
            }
          ]
        }
      )
    },
    goToDetails(groupId) {
      this.$router.push('/groups/' + groupId)
    }
  }
}
</script>
