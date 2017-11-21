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
      data: {},
    }
  },
  methods: {
    random_color() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return `rgba(${r},${g},${b},0.7)`
    },
    query: async function() {
      this.data = await this.$agent.p_mfa('ws_report', 'agents_states', [])
      this.data.datasets.forEach( (X) => {
        X.borderColor = this.random_color();
        X.fill = false
        X.steppedLine = true
      })
      this.chart = new Chart("report", {
        type: 'line',
        data: this.data,
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
