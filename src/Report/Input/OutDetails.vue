<template>
  <b-row style="padding: 0; margin: 0">
    <b-col style="padding: 0; margin: 0">
      <div>From:</div>
      <widget-date :value="date_start" @input="onFromChange" placeholder="Start date" :initValue="init_start"
                   style="padding-bottom: 10px"></widget-date>
      <div>To:</div>
      <widget-date v-model="date_end" placeholder="End date" :initValue="init_end"
                   style="padding-bottom: 30px"></widget-date>
      <div>Interval [min]:</div>
      <div style="padding-bottom: 30px">
        <b-form-input v-model="interval" id="sla" type="number"></b-form-input>
      </div>
      <button @click="reset" class="btn btn-outline-secondary float-right">Reset</button>
      <button @click="apply" class="btn btn-outline-secondary float-right" style="margin-right: 20px">Apply</button>
    </b-col>
  </b-row>
</template>

<script>
  import ReportDate from '@/Report/Widget/Date'
  import Moment from 'moment'

  export default {
    name: 'out-details',
    props: ['from', 'to', 'initInterval'],
    components: {
      'widget-date': ReportDate,
    },
    data () {
      return {
        date_start: undefined,
        date_end: undefined,
        interval: undefined,
        init_start: this.from,
        init_end: this.to,
        init_interval: this.initInterval,
        status: "no"
      }
    },
    methods: {
      reset () {
        this.date_start = Moment(this.init_start).unix()
        this.date_end = Moment(this.to).unix()
        this.interval = this.initInterval
        this.$emit('input', this.make_query())
      },
      apply () {
        this.$emit('input', this.make_query())
      },
      make_query() {
        return {
          date_start: this.date_start,
          date_end: this.date_end,
          interval: this.interval,
          status: this.status
        }
      },
      onFromChange(v) {
        this.date_start = v
      }
    },

    created () {
      this.date_start = Moment(this.from).unix()
      this.date_end = Moment(this.to).unix()
      this.interval = this.initInterval
      this.status = 'no'
    }
  }
</script>
