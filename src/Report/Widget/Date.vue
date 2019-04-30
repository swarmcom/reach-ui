<template>
  <datepicker
    v-model="date"
    :placeholder="placeholder"
    :highlighted="highlighted"
    bootstrap-styling
  />
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'ReportWidgetDate',
  components: {Datepicker},
  props: {
    value: {
      type: [Number, String, Object],
      default: ""
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      date: undefined,
      highlighted: {
        dates: [new Date()]
      }
    }
  },
  watch: {
    value (value, old) {
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
  },
  created () {
    if (parseInt(this.value)) {
      this.date = moment.unix(this.value).format()
    }
  },
  methods: {
    to_timestamp(date) {
      if (date) {
        return (new moment(date)).format("X")
      } else {
        return undefined
      }
    },
  }
}
</script>
