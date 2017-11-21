<template>
<div>
  <b-row>
    <b-col></b-col>
  </b-row>
  <canvas id="report"></canvas>
</div>
</template>

<script>
import Chart from 'chart.js';
import moment from 'moment';

export default {
  name: 'report-agents-states',
  data () {
    return {
      chart: undefined,
      re: {},
      palette: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
      palette_id: 0
    }
  },
  methods: {
    color(self) {
      self.palette_id = (self.palette_id+1) % self.palette.length
      return self.palette[self.palette_id]
    },
    query: async function() {
      this.re = await this.$agent.p_mfa('ws_report', 'agents_states', [])
      this.re.datasets.forEach( (X) => {
        X.borderColor = this.color(this);
        X.fill = false
        X.steppedLine = true
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
