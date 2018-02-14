<template>
  <div style="margin: 0; padding-bottom: 20px">
    <div>From:</div>
    <datepicker :value="from_to.date_start" @input="onFromChange" placeholder="Start date" :highlighted="highlighted" bootstrapStyling style="padding-bottom: 10px"></datepicker>
    <div>To:</div>
    <datepicker :value="from_to.date_end" @input="onToChange" placeholder="End date" :highlighted="highlighted" bootstrapStyling style="padding-bottom: 10px"></datepicker>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'

export default {
  name: 'from-to-input',
  props: ['value'],
  components: {
    'datepicker': Datepicker
  },
  data () {
    return {
      from_to: Object.assign({}, this.value),
      highlighted: {
        dates: [new Date()]
      }
    }
  },
  methods: {
    onFromChange (v) {
      this.from_to.date_start = Moment(v).format()
      this.$emit('input', Object.assign({}, this.from_to))
    },
    onToChange (v) {
      this.from_to.date_end = Moment(v).format()
      this.$emit('input', Object.assign({}, this.from_to))
    }
  },
  watch: {
    value (v) {
      this.from_to = Object.assign({}, v)
      return v
    }
  }
}
</script>
