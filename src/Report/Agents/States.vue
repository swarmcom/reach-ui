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
      palette: [
        '#781c81', '#d92120', '#4d1f82', '#e34d28', '#403e95', '#e77830', '#4063b0', '#4684c2', '#e39a36',
        '#519cb8', '#62ac9a', '#77b77b', '#90bc62', '#abbe51', '#c3ba45', '#d7af3d'
      ],
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
