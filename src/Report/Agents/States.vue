<template>
<div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <datepicker v-model="date_start" placeholder="Start date" :highlighted="highlighted" bootstrapStyling></datepicker>
    </b-col>
    <b-col cols=3>
      <datepicker v-model="date_end" placeholder="End date" :highlighted="highlighted" readonly bootstrapStyling></datepicker>
    </b-col>
    <b-col>
      <select2 :options="groups" v-model="groups_selected"></select2>
    </b-col>
    <b-col cols=1>
      <button @click="filter" class="btn btn-outline-primary">Apply</button>
    </b-col>
  </b-row>
  <canvas id="report"></canvas>
</div>
</template>

<script>
import Chart from 'chart.js'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Select2 from '@/Widget/Select2'

export default {
  name: 'report-agents-states',
  components: { Datepicker, Select2 },
  data () {
    return {
      chart: undefined,
      re: {},
      palette: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
      palette_id: 0,
      highlighted: {
        dates: [new Date()]
      },
      date_start: undefined,
      date_end: undefined,
      groups: [],
      groups_selected: []
    }
  },
  methods: {
    color (self) {
      self.palette_id = (self.palette_id+1) % self.palette.length
      return self.palette[self.palette_id]
    },
    filter () {
      this.query()
    },
    to_timestamp(date) {
      if (date) {
        return (new moment(date)).format("X")
      } else {
        return undefined
      }
    },
    make_query() {
      return {
        date_start: this.to_timestamp(this.date_start),
        date_end: this.to_timestamp(this.date_end),
        groups: this.groups_selected
      }
    },
    query: async function() {
      this.palette_id = 0
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get', [])
      this.groups.forEach( X => X.text = X.name )
      this.re = await this.$agent.p_mfa('ws_report', 'agents_states', [this.make_query()])
      this.re.datasets.forEach( (X) => {
        X.borderColor = this.color(this);
        X.fill = false
        X.steppedLine = 'before'
      })
      if (this.chart) {
        this.update_chart(this.re)
      } else {
        this.make_chart(this.re)
      }
    },
    update_chart (data) {
      this.chart.data = data
      this.chart.update()
    },
    make_chart (data) {
      this.chart = new Chart("report", {
        type: 'line',
        data: data,
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                parser: (X) => new moment(X, "X")
              }
            }],
            yAxes: [{
              stacked: false,
            }]
          },
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.query()
  }
}
</script>
