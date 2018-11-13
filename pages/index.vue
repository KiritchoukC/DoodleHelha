<template>
  <section
    :class="{'cursor-wait': loading}"
    class="flex flex-col items-center justify-center">
    <div class="row flex flex-column justify-center items-center col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
      <h1 class="text-center text-5xl"><span class="text-primary">HEL</span>Ha Doodle</h1>
    </div>
    <hr class="hr--primary bg-primary mb-5 mt-3">
    <form
      class="row col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3"
      @submit.prevent="submit">
      <label
        for="username"
        class="font-semibold">Ton petit nom ?</label>
      <input
        v-validate="{required: true}"
        id="username"
        v-model="username"
        type="text"
        name="username"
        autocomplete="username"
        class="w-full pl-2 pt-2 pb-2 mt-1 no-outline bg-grey-lightest rounded">
      <span class="text-red font-semibold mt-1 form--error">{{ errors.first('username') }}</span>
      <label
        for="password"
        class="font-semibold mt-2">Ton mot de passe super secret</label>
      <input
        v-validate="{required: true}"
        id="password"
        v-model="password"
        type="password"
        name="password"
        autocomplete="current-password"
        class="w-full pl-2 pt-2 pb-2 mt-1 no-outline bg-grey-lightest rounded">
      <span class="text-red font-semibold mt-1 form--error">{{ errors.first('password') }}</span>
      <label
        v-if="registering"
        class="font-semibold mt-2"
        for="passwordConfirmation">Confirmation du mot de passe</label>
      <input
        v-validate="{ is: password, required: true }"
        v-if="registering"
        id="passwordConfirmation"
        v-model="passwordConfirmation"
        type="password"
        name="passwordConfirmation"
        autocomplete="current-password"
        class="w-full pl-2 pt-2 pb-2 mt-1 no-outline bg-grey-lightest rounded">
      <span class="text-red font-semibold mt-1 form--error">{{ errors.first('passwordConfirmation') }}</span>
      <br>
      <br>
      <div
        v-if="!registering"
        class="w-full mt-2">
        <button
          :class="{'bg-primary-lighter cursor-default': disabled}"
          :disabled="disabled"
          type="submit"
          class="w-full pt-2 pb-2 mt-2 mb-2 rounded font-semibold bg-primary no-outline text-grey-lightest">
          {{ loading ? 'Chargement...' : 'Se connecter' }}
        </button>
        <button
          :disabled="loading"
          class="w-full pt-2 pb-2 mb-2 rounded font-semibold bg-grey-light no-outline"
          @click.prevent="toggleRegister()">
          S'enregistrer
        </button>
      </div>
      <div
        v-else
        class="w-full mt-2">
        <button
          :class="{'bg-primary-lighter cursor-default': registerDisabled}"
          :disabled="registerDisabled"
          type="submit"
          class="w-full pt-2 pb-2 mt-2 mb-2 rounded font-semibold bg-primary no-outline text-grey-lightest">
          {{ loading ? 'Chargement...' : 'S\'enregistrer' }}
        </button>
        <button
          :disabled="loading"
          type="button"
          class="w-full pt-2 pb-2 mb-2 rounded font-semibold bg-grey-light no-outline"
          @click.prevent="toggleRegister()">
          Retour
        </button>
      </div>
    </form>
    <div class="blank"/>
  </section>
</template>

<style scope>
.blank {
  width: 100vw;
  height: 100px;
}
</style>

<script>
export default {
  auth: false,
  layout: 'blank',
  data() {
    return {
      loading: false,
      registering: false,
      username: '',
      password: '',
      passwordConfirmation: ''
    }
  },
  head() {
    return {
      title: `DoodleHELHa - ${
        this.registering ? 'Enregistrement' : 'Connexion'
      }`
    }
  },
  computed: {
    disabled() {
      return (
        this.loading ||
        this.errors.any() ||
        this.username.length === 0 ||
        this.password.length === 0
      )
    },
    registerDisabled() {
      return (
        this.loading ||
        this.errors.any() ||
        this.username.length === 0 ||
        this.password.length === 0 ||
        this.passwordConfirmation === 0
      )
    }
  },
  beforeMount() {},
  mounted: function() {
    console.log(process)
  },
  methods: {
    submit() {
      this.loading = true
      if (this.registering) {
        if (this.password === this.passwordConfirmation) {
          this.$toast.info("J'appelle internet...")
          this.$axios
            .post('/users/register', {
              user: {
                email: this.username,
                password: this.password
              }
            })
            .then(() => {
              location.reload()
              this.$toast.success(
                `Bonjour ${
                  this.username
                }. Vous pouvez maintenant vous connecter`
              )
            })
            .catch(err => {
              if (err.response.status === 409) {
                this.$toast.error(
                  `Le nom d'utilisateur ${this.username} existe déjà`
                )
                this.loading = false
              } else {
                this.$toast.error(err)
                this.loading = false
              }
            })
        } else {
          this.loading = false
          this.$toast.error('Les mots de passe ne sont pas identiques')
        }
      } else {
        const infoToast = this.$toast.info("J'appelle internet...")
        this.$auth
          .loginWith('local', {
            data: {
              user: {
                email: this.username,
                password: this.password
              }
            }
          })
          .then(() => {
            infoToast.remove()
            this.$socket.emit('user_logged', this.$auth.user._id)
            this.$toast.success(`Bonjour ${this.$auth.user.email} !`)
            this.$router.push('/groups/list')
          })
          .catch(err => {
            this.$toast.error(err.statusText)
            this.loading = false
          })
      }
    },
    toggleRegister() {
      this.registering = !this.registering
      this.$socket.emit('emit_method', this.registering)
    }
  }
}
</script>
