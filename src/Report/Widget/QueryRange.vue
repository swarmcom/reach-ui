<template>
<b-row>
  <b-col cols=3>
    <widget-date v-model="date_start" placeholder="Start date"></widget-date>
  </b-col>
  <b-col cols=3>
    <widget-date v-model="date_end" placeholder="End date"></widget-date>
  </b-col>
  <b-col>
    <button @click="reset" class="btn btn-outline-success float-right">Reset</button>
    <button @click="apply" class="btn btn-outline-primary float-right" style="margin-right: 20px">Apply</button>
  </b-col>
</b-row>
</template>

<script>
import ReportDate from '@/Report/Widget/Date'

export default {
  name: 'report-query-range',
  props: ['value'],
  components: {
    'widget-date': ReportDate,
  },
  data () {
    return {
      date_start: undefined,
      date_end: undefined
    }
  },
  methods: {
    reset () {
      this.date_start = undefined,
      this.date_end = undefined,
      this.$emit('input', this.make_query())
    },
    apply () {
      this.$emit('input', this.make_query())
    },
    make_query() {
      return {
        date_start: this.date_start,
        date_end: this.date_end,
      }
    },
  }
}
</script>
