<template>
  <b-row style="padding: 0; margin: 0">
    <b-col style="padding: 0; margin: 0">
      <div>From:</div>
      <widget-date :value="date_start" @input="onFromChange" placeholder="Start date" :initValue="init_start"
                   style="padding-bottom: 10px"></widget-date>
      <div>To:</div>
      <widget-date v-model="date_end" placeholder="End date" :initValue="init_end"
                   style="padding-bottom: 30px"></widget-date>
      <button @click="reset" class="btn btn-outline-secondary float-right">Reset</button>
      <button @click="apply" class="btn btn-outline-secondary float-right" style="margin-right: 20px">Apply</button>
    </b-col>
  </b-row>
</template>

<script>
  import ReportDate from '@/Report/Widget/Date'
  import Moment from 'moment'

  export default {
    name: 'report-from-to',
    props: ['from', 'to'],
    components: {
      'widget-date': ReportDate,
    },
    data () {
      return {
        date_start: undefined,
        date_end: undefined,
        init_start: this.from,
        init_end: this.to
      }
    },
    methods: {
      reset () {
        this.date_start = Moment(this.init_start).unix()
        this.date_end = Moment(this.to).unix()
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
      onFromChange(v) {
        console.log("FromTo.vue updated FROM INPUT with:", v)
        this.date_start = v
      }
    },

    created () {
      this.date_start = Moment(this.from).unix()
      this.date_end = Moment(this.to).unix()
    }
  }
</script>
