<template>
  <section v-if="group">
    <div class="z-10 col-12 col-sm-12 offset-md-1 col-md-10 offset-lg-1 col-lg-10 offset-xl-2 col-xl-8">
      <div class="row">
        <div class="flex items-center col-xl-2 col-lg-2 col-md-2 col-sm-3 col-4">
          <nuxt-link
            class="text-black dim"
            to="/groups/list">
            <no-ssr><font-awesome-icon icon="arrow-left" /></no-ssr>
          </nuxt-link>
        </div>
        <div class=" col-xl-8 col-lg-8 col-md-8 col-sm-6 col-4">
          <h1 class="text-center">
            {{ group.name || 'Pas de nom' }}
          </h1>
        </div>
        <div class="flex items-center actions col-xl-2 col-lg-2 col-md-2 col-sm-3 col-4">
          <button
            class="no-outline dim mr-6"
            @click.prevent="remove(group)">
            <no-ssr><font-awesome-icon
              icon="trash"
              class="text-red" /></no-ssr>
          </button>
          <button
            class="no-outline dim mr-6"
            @click="openAddUserModal">
            <no-ssr><font-awesome-icon icon="user-plus" /></no-ssr>
          </button>
          <button
            class="svg-btn no-outline dim"
            @click="toggleForm">
            <svg
              :class="{'svg-rotate-start': !pollForm, 'svg-rotate-end': pollForm}"
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
      </div>
    </div>
    <h2 class="text-grey flex justify-center items-center text-center">
      {{ group.description || 'Pas de description' }}
    </h2>
    <hr class="hr--primary bg-primary">
    <div class="list flex flex-column justify-center items-center w-full">
      <poll-form
        ref="pollFormEl"
        :style="formPollStyles"
        @submit="onSubmit"/>
      <div
        ref="listContainerEl"
        :style="listContainerStyles"
        class="list__item__container w-full col-12 col-sm-12 col-md-8 col-lg-6">
        <list-item
          v-for="poll in group.polls"
          :key="poll._id"
          :item="poll"
          @goToDetails="goToDetails"
          @remove="remove"/>
        <div
          v-if="loading"
          class="list__item flex justify-center items-center w-full"><loading/></div>
      </div>
    </div>
    <modal
      :width="300"
      :height="700"
      :draggable="true"
      name="addUser"
      @before-close="saveUsers">
      <multiselect
        v-model="value"
        :options="options"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
        :preserve-search="true"
        :loading="usersLoading"
        placeholder="Utilisateurs du groupe"
        label="email"
        track-by="_id"/>
    </modal>
    <v-dialog/>
  </section>
</template>

<style scoped>
</style>

<script>
export default {
  name: 'Id',
  async asyncData({ params, error, app }) {
    try {
      const result = await app.$axios.get('/groups/' + params.id).catch(e => {
        let message
        switch (e.response.status) {
          case 403:
            message = "Vous n'avez pas accès à ce groupe"
            break

          default:
            message = e.message
            break
        }
        error({ statusCode: e.response.status, message })
      })
      if (result) {
        return {
          group: result.data || {},
          value: result.data.users || []
        }
      }
    } catch (err) {
      error({ statusCode: params.statusCode, message: err.message })
    }
  },
  data() {
    return {
      listContainerStyles: {},
      loading: false,
      pollForm: false,
      pollFormHeight: 229,
      listContainerHeight: 0,
      formPollStyles: {
        opacity: 0,
        transform: 'translateY(-229px)',
        marginBottom: '-219px',
        transition: 'transform ease-in-out 0.3s, opacity ease-in-out 0.3s'
      },
      options: [],
      usersLoading: true
    }
  },
  computed: {},
  beforeDestroy() {
    this.$socket.off('removed_from_group')
  },
  mounted: function() {
    this.$socket.on('removed_from_group', group => {
      if (this.group._id === group._id) {
        this.$router.push('/groups/list')
      }
    })
    this.$nextTick().then(() => {
      this.listContainerStyles = {
        height: this.$refs.listContainerEl.offsetHeight,
        transition: 'margin-top ease-in-out 0.3s, height ease-in-out 0.3s'
      }
      this.listContainerHeight = this.listContainerStyles.height
    })
  },
  head() {
    return {
      title: `DoodleHelha - Groupe : ${this.group.name || 'Details'}`
    }
  },
  methods: {
    toggleForm() {
      if (this.pollForm) {
        this.formPollStyles.opacity = 0
        this.formPollStyles.transform = `translateY(-${this.pollFormHeight}px)`
        this.listContainerStyles.marginTop = `0px`
        this.listContainerStyles.height =
          this.listContainerHeight + this.pollFormHeight + 'px'
      } else {
        this.formPollStyles.opacity = 1
        this.formPollStyles.transform = `translateY(0px)`
        this.listContainerStyles.marginTop = `${this.pollFormHeight}px`
        this.listContainerStyles.height =
          this.listContainerHeight - this.pollFormHeight + 'px'
      }

      this.pollForm = !this.pollForm
    },
    onSubmit(pollForm) {
      this.toggleForm()
      this.loading = true
      const form = {
        groupId: this.group._id,
        creationUserId: this.$auth.user._id,
        creationDate: new Date(),
        name: pollForm.name,
        description: pollForm.description
      }
      this.$axios
        .post('/polls', form)
        .then(result => {
          this.loading = false
          this.group.polls.push(result.data)
        })
        .catch(err => console.error(err))
    },
    remove(group) {
      this.$modal.show('dialog', {
        title: `Suppression du groupe`,
        text: `Êtes-vous sûr de vouloir supprimer le groupe ${
          this.group.name
        } ?`,
        buttons: [
          {
            title: 'Annuler' // Button title
          },
          {
            title: 'Supprimer',
            default: true, // Will be triggered by default if 'Enter' pressed.
            handler: () => {
              this.$axios
                .delete('/groups/' + group._id)
                .then(result => {
                  this.$router.push('/groups/list')
                })
                .catch(err => {
                  this.$toast.danger(err.message)
                })
            } // Button click handler
          }
        ]
      })
    },
    goToDetails(pollId) {
      this.$router.push('/polls/' + pollId)
    },
    openAddUserModal() {
      this.$modal.show('addUser')
      this.$axios
        .get('/users')
        .then(res => {
          this.options = res.data
            .filter(user => user._id !== this.group.creationUserId)
            .map(user => {
              return {
                email: user.email,
                _id: user._id
              }
            })
          this.usersLoading = false
        })
        .catch(e => {
          console.error(e)
          this.$toast.error(e.message)
        })
    },
    saveUsers() {
      // Get the removed users
      const removedUsers = this.group.users.filter(
        user => this.value.findIndex(v => v._id === user._id) < 0
      )
      // Get the added users
      const addedUsers = this.value.filter(
        user => this.group.users.findIndex(v => v._id === user._id) < 0
      )
      // Show loading
      this.usersLoading = true
      // Update the goup's users
      this.group.users = JSON.parse(JSON.stringify(this.value))
      // Build the group object to update
      const group = JSON.parse(JSON.stringify(this.group))
      group.users = this.value.map(user => user._id)
      // Put request to update group with the added AND/OR removed users
      this.$axios
        .put(`/groups/${this.group._id}`, group)
        .then(res => {
          // Hide loading
          this.usersLoading = false

          // Notify removed users
          if (removedUsers.length) {
            const removeData = {
              group: this.group,
              removedUsers: removedUsers.map(u => u._id)
            }
            this.$socket.emit('remove_users_from_group', removeData)
          }

          // Notify added users
          if (addedUsers.length) {
            const addData = {
              group: this.group,
              addedUsers: addedUsers.map(u => u._id)
            }
            this.$socket.emit('add_users_from_group', addData)
          }
        })
        .catch(err => {
          console.error(err)
          this.$toast.error(err.message)
        })
    }
  }
}
</script>
