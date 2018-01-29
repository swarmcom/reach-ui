<template>
<datepicker v-model="date" :placeholder="placeholder" :highlighted="highlighted" bootstrapStyling></datepicker>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'report-widget-date',
  components: {Datepicker},
  props: ['initValue', 'value', 'placeholder'],
  data () {
    return {
      date: this.initValue,
      highlighted: {
        dates: [new Date()]
      }
    }
  },
  methods: {
    to_timestamp(date) {
      if (date) {
        return moment(date).unix()
      } else {
        return undefined
      }
    },
  },
  watch: {
    value (value) {
      if (parseInt(value)) {
        this.date = moment.unix(value).format()
      } else {
        this.date = value
      }
      return value
    },
    date (value) {
      this.$emit('input', this.to_timestamp(value))
    }
  }
}
</script>
