<template>
  <div class="calendar">
    <div class="flex justify-between items-center offset-0 col-12 offset-sm-1 col-sm-10 mb-4 rounded-full bg-primary-lightest p-4 shadow">
      <button
        title="Année précédente"
        class="text-black darken no-outline text-primary-light w-8"
        @click="previousYear">
        <font-awesome-icon
          icon="backward"
          size="lg" />
      </button>
      <button
        title="Mois précédent"
        class="text-black darken no-outline text-primary-light w-8"
        @click="previousMonth">
        <font-awesome-icon
          icon="caret-left"
          size="lg" />
      </button>
      <span class="text-center text-primary-dark font-semibold w-32">{{ fullMonths[currentMonth] }} {{ currentYear }}</span>
      <button
        title="Mois suivant"
        class="text-black darken no-outline text-primary-light w-8"
        @click="nextMonth">
        <font-awesome-icon
          icon="caret-right"
          size="lg" />
      </button>
      <button
        title="Année suivante"
        class="text-black darken no-outline text-primary-light w-8"
        @click="nextYear">
        <font-awesome-icon
          icon="forward"
          size="lg" />
      </button>
    </div>
    <div class="col-12">
      <table class="w-full">
        <thead>
          <th
            v-for="day in daysOfWeek"
            :key="day"
            class="text-center h-8">{{ day }}</th>
        </thead>
        <tbody class="w-full">
          <tr
            v-for="row in rowsNumber"
            :key="row"
            class="w-full">
            <td
              v-for="c in rows[row-1]"
              :key="c.day"
              :class="getClasses(c)"
              class="text-center w-1/7 h-12 border-4 border-white"
              @click="pick(c)">
              {{ c.day }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
export default {
  props: {
    availableDays: {
      type: Array,
      default: () => []
    },
    awayDays: {
      type: Array,
      default: () => []
    },
    maybeDays: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      name: '',
      description: '',
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      daysOfWeek: ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'],
      months: [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sep',
        'Oct',
        'Nov',
        'Déc'
      ],
      fullMonths: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
      ],
      format: 'dd/mm/yyyy',
      rowsNumber: 5,
      firstDayOfCurrentMonth: 0,
      lastDateOfCurrentMonth: 0,
      lastDateOfLastMonth: 0,
      lastMonthDays: 0,
      rows: []
    }
  },
  computed: {},
  mounted: function() {
    this.$nextTick().then(() => {
      this.showCurrent()
    })
  },
  methods: {
    getClasses(cell) {
      let classes = ''
      if (cell.currentMonth) classes += 'pointer hover:bg-grey-lighter'
      else classes += 'text-grey'
      if (this.isAvailable(cell))
        classes += ' bg-green hover:bg-green-dark text-grey-lightest'
      if (this.isAway(cell))
        classes += ' bg-red hover:bg-red-dark text-grey-lightest'
      if (this.isMaybe(cell))
        classes += ' bg-orange hover:bg-orange-dark hover:text-grey-lightest'
      return classes
    },
    pick(c) {
      if (c.currentMonth) {
        const datePicked = new Date(this.currentYear, this.currentMonth, c.day)
        this.$emit('dayPicked', datePicked)
      }
    },
    isAvailable(c) {
      if (!c.currentMonth) return false
      const date = new Date(this.currentYear, this.currentMonth, c.day)
      const index = this.availableDays.findIndex(
        x => x.getTime() === date.getTime()
      )
      return index !== -1
    },
    isAway(c) {
      if (!c.currentMonth) return false
      const date = new Date(this.currentYear, this.currentMonth, c.day)
      const index = this.awayDays.findIndex(x => x.getTime() === date.getTime())
      return index !== -1
    },
    isMaybe(c) {
      if (!c.currentMonth) return false
      const date = new Date(this.currentYear, this.currentMonth, c.day)
      const index = this.maybeDays.findIndex(
        x => x.getTime() === date.getTime()
      )
      return index !== -1
    },
    getLastMonthDay(day) {
      this.lastMonthDays--
      return this.lastDateOfLastMonth - this.lastMonthDays + day
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
      this.showCurrent()
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
      this.showCurrent()
    },
    nextYear() {
      this.currentYear++
      this.showCurrent()
    },
    previousYear() {
      this.currentYear--
      this.showCurrent()
    },
    showCurrent() {
      const year = this.currentYear
      const month = this.currentMonth

      this.firstDayOfCurrentMonth = new Date(year, month, 1).getDay()
      this.lastDateOfCurrentMonth = new Date(year, month + 1, 0).getDate()
      this.lastDateOfLastMonth =
        month === 0
          ? new Date(year - 1, 11, 0).getDate()
          : new Date(year, month, 0).getDate()

      this.lastMonthDays = this.firstDayOfCurrentMonth - 1
      this.rowsNumber = Math.ceil(
        (this.lastMonthDays + this.lastDateOfCurrentMonth) / 7
      )
      let lmd = this.lastMonthDays
      this.rows = []
      let currentDay = 0
      let newMonthDay = 1
      for (let i = 0; i < this.rowsNumber; i++) {
        const cols = []
        for (let day = 1; day <= 7; day++) {
          if (lmd > 0) {
            cols.push({
              currentMonth: false,
              day: this.lastDateOfLastMonth + 1 - lmd
            })
            lmd--
          } else {
            if (currentDay === this.lastDateOfCurrentMonth) {
              cols.push({ currentMonth: false, day: newMonthDay })
              newMonthDay++
            } else {
              currentDay = 7 * i + day - this.lastMonthDays
              cols.push({ currentMonth: true, day: currentDay })
            }
          }
        }
        this.rows.push(cols)
      }
    }
  }
}
</script>
