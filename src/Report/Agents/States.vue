<template>
<div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <datepicker v-model="date_start" placeholder="Start date" :highlighted="highlighted" bootstrapStyling></datepicker>
    </b-col>
    <b-col cols=3>
      <datepicker v-model="date_end" placeholder="End date" :highlighted="highlighted"  bootstrapStyling></datepicker>
    </b-col>
    <b-col>
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

export default {
  name: 'report-agents-states',
  components: { Datepicker },
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
      date_end: undefined
    }
  },
  methods: {
    color (self) {
      self.palette_id = (self.palette_id+1) % self.palette.length
      return self.palette[self.palette_id]
    },
    filter () {
      this.chart.destroy()
      this.query()
    },
    to_timestamp(date) {
      if (date) {
        return (new moment(date)).format("X")
      } else {
        return undefined
      }
    },
    query: async function() {
      this.palette_id = 0
      this.re = await this.$agent.p_mfa('ws_report', 'agents_states', [this.to_timestamp(this.date_start), this.to_timestamp(this.date_end)])
      this.re.datasets.forEach( (X) => {
        X.borderColor = this.color(this);
        X.fill = false
        X.steppedLine = 'before'
      })
      this.chart = new Chart("report", {
        type: 'line',
        data: this.re,
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
    },
  },
  created () {
  },
  mounted () {
    this.query()
  }
}
</script>
