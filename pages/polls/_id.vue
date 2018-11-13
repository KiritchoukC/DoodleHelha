<template>
  <section
    v-if="poll"
    class="col-12 col-sm-12 offset-md-1 col-md-10 offset-lg-1 col-lg-10 offset-xl-2 col-xl-8">
    <div class="z-10">
      <button
        class="text-black dim absolute pin-l"
        style="line-height:2.4"
        @click="goBack">
        <font-awesome-icon icon="arrow-left" />
      </button>
      <h1 class="text-center">
        {{ poll.name || 'Pas de nom' }}
      </h1>
    </div>
    <h2 class="text-grey text-center mt-1">
      {{ poll.description || 'Pas de description' }}
    </h2>
    <p class="text-grey w-full text-center mt-2">Créé le {{ poll.creationDate | getDate }} à {{ poll.creationDate | getTime }}</p>
    <hr class="hr--primary bg-primary mb-4">
    <div class="mb-4 col-12 offset-sm-1 col-sm-10 offset-md-1 col-md-10 offset-lg-2 col-lg-8 offset-xl-2 col-xl-8">
      <div class="row">
        <ol class="col-8">
          <li
            :class="[
              available.current ? 'pointer grow text-green font-semibold': 'text-grey',
              !available.done && available.current ? 'not-done': '',
              available.done ? 'done' : '']"
            @click="done()">
            Définis les jours où tu es présent
          </li>
          <li
            :class="[
              away.current ? 'pointer grow red font-semibold': 'text-grey',
              !away.done && away.current ? 'not-done': '',
              away.done ? 'done' : '']"
            @click="done()">
            Définis les jours où tu es absent
          </li>
          <li
            :class="[
              maybe.current ? 'pointer grow orange font-semibold': 'text-grey',
              !maybe.done && maybe.current ? 'not-done': '',
              maybe.done ? 'done' : '']"
            @click="done()">
            Définis les jours où tu es peut-être présent
          </li>
        </ol>
        <div class="col-4 flex items-center">
          <font-awesome-icon
            v-if="available.done && away.done"
            icon="check-circle"
            size="3x"
            class="pointer text-green dim"
            @click="end()" />
          <font-awesome-icon
            v-else
            icon="check"
            size="3x"
            class="pointer text-green dim"
            @click="done()" />
        </div>
      </div>
    </div>
    <calendar
      :available-days="availableDays"
      :away-days="awayDays"
      :maybe-days="maybeDays"
      @dayPicked="dayPicked"/>
  </section>
</template>

<style scoped>
.not-done:hover,
.not-done:focus {
  text-decoration: line-through;
}
.done {
  text-decoration: line-through;
}
</style>


<script>
export default {
  name: 'Id',
  asyncData({ params, error, app }) {
    return app.$axios
      .get('/polls/' + params.id)
      .then(res => {
        return { poll: res.data }
      })
      .catch(e => {
        error({ statusCode: 404, message: 'Group not found' })
      })
  },
  data() {
    return {
      available: { current: true, done: false },
      away: { current: false, done: false },
      maybe: { current: false, done: false },
      availableDays: [],
      awayDays: [],
      maybeDays: []
    }
  },
  head() {
    return {
      title: `DoodleHelha - Sondage : ${this.poll.name || 'Details'}`
    }
  },
  computed: {
    allDone() {
      return this.available.done && this.away.done && this.maybe.done
    }
  },
  mounted: function() {
    this.$nextTick().then(() => {
      if (this.poll.entries) {
        this.poll.entries.forEach(entry => {
          if (entry.status === 'available')
            this.availableDays.push(new Date(entry.day))
          if (entry.status === 'away') this.awayDays.push(new Date(entry.day))
          if (entry.status === 'maybe') this.maybeDays.push(new Date(entry.day))
        })
      }
    })
  },
  methods: {
    goBack() {
      window.history.back()
    },
    end() {
      // Build data
      const avDays = this.availableDays.map(day => {
        return {
          day: day,
          status: 'available',
          pollId: this.poll._id
        }
      })
      const awDays = this.awayDays.map(day => {
        return {
          day: day,
          status: 'away',
          pollId: this.poll._id
        }
      })
      const mbDays = this.maybeDays.map(day => {
        return {
          day: day,
          status: 'maybe',
          pollId: this.poll._id
        }
      })
      const entries = avDays.concat(awDays).concat(mbDays)
      this.$axios
        .post('/entries/' + this.poll._id, entries)
        .then(res => {
          this.goBack()
        })
        .catch(err => this.$toast('Something went wrong !' + err.message))
    },
    done() {
      if (this.available.current) {
        this.available.done = true
        this.available.current = false
        this.away.current = true
        return
      }
      if (this.away.current) {
        this.away.done = true
        this.away.current = false
        this.maybe.current = true
        return
      }
      if (this.maybe.current) {
        this.maybe.done = true
        this.maybe.current = false
        return
      }
    },
    dayPicked(day) {
      const mode = this.available.current
        ? 'available'
        : this.away.current
          ? 'away'
          : 'maybe'
      this.addOrRemoveDay(day, mode)
    },
    addOrRemoveDay(day, mode) {
      // Get the index of the available day if it exists.
      const avIndex = this.availableDays.findIndex(
        x => x.getTime() === day.getTime()
      )
      // Get the index of the away day if exists
      const awIndex = this.awayDays.findIndex(
        x => x.getTime() === day.getTime()
      )
      // Get the index of the maybe day if exists
      const mbIndex = this.maybeDays.findIndex(
        x => x.getTime() === day.getTime()
      )

      if (awIndex !== -1) {
        // If exists remove it
        this.awayDays.splice(awIndex, 1)
      }
      if (mbIndex !== -1) {
        // If exists remove it
        this.maybeDays.splice(mbIndex, 1)
      }
      if (avIndex !== -1) {
        // If exists remove it
        this.availableDays.splice(avIndex, 1)
      }

      if (mode === 'available' && avIndex === -1) {
        // If the day isn't registered yet ...
        this.availableDays.push(day)
      }

      if (mode === 'away' && awIndex === -1) {
        // If the day isn't registered yet ...
        this.awayDays.push(day)
      }

      if (mode === 'maybe' && mbIndex === -1) {
        // If the day isn't registered yet ...
        this.maybeDays.push(day)
      }
    }
  }
}
</script>

<style scoped>
.title {
  margin-top: 30px;
}
.info {
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button {
  margin-top: 30px;
}

.creation-date {
  color: hsl(0, 0%, 70%);
}
</style>
