<template>
  <b-row style="padding: 0; margin: 0">
    <b-col style="padding: 0; margin: 0">
      <div>From:</div>
      <widget-date :value="date_start" @input="onFromChange" placeholder="Start date" :initValue="init_start"
                   style="padding-bottom: 10px"></widget-date>
      <div>To:</div>
      <widget-date v-model="date_end" placeholder="End date" :initValue="init_end"
                   style="padding-bottom: 30px"></widget-date>
      <div>SLA target answer time [s]:</div>
      <div style="padding-bottom: 30px">
        <b-form-input v-model="sla" id="sla" type="number"></b-form-input>
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
    name: 'report-from-to',
    props: ['from', 'to', 'initSLA'],
    components: {
      'widget-date': ReportDate,
    },
    data () {
      return {
        date_start: undefined,
        date_end: undefined,
        sla: undefined,
        init_start: this.from,
        init_end: this.to,
        init_sla: this.initSLA
      }
    },
    methods: {
      reset () {
        this.date_start = Moment(this.init_start).unix()
        this.date_end = Moment(this.to).unix()
        this.sla = this.initSLA
        this.$emit('input', this.make_query())
      },
      apply () {
        this.$emit('input', this.make_query())
      },
      make_query() {
        return {
          date_start: this.date_start,
          date_end: this.date_end,
          sla: this.sla
        }
      },
      onFromChange(v) {
        this.date_start = v
      }
    },

    created () {
      this.date_start = Moment(this.from).unix()
      this.date_end = Moment(this.to).unix()
      this.sla = this.initSLA
    }
  }
</script>
