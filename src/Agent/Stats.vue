<template>
<div>
  <b-row>
    <b-col><h3>Stats:</h3></b-col>
    <b-col>
      <select class="custom-select" style="width: 100%" @change="set_period($event.target.value)">
        <option v-for="period in periods" :value="period" :selected="isActive(period)">{{ period }}</option>
      </select>
    </b-col>
  </b-row>
  <b-row style="margin-top: 10px">
    <b-col>
      <table class="table table-striped table-sm">
        <caption>Call metrics</caption>
        <thead>
          <tr>
            <td></td>
            <td>My</td>
            <td>Group</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Longest</td>
            <td>{{ time(stats.cpt.longest) }}</td>
            <td>{{ time(group_stats.cpt.longest) }}</td>
          </tr>
          <tr>
            <td>CPT</td>
            <td>{{ time(stats.cpt.cpt) }}</td>
            <td>{{ time(group_stats.cpt.cpt) }}</td>
          </tr>
          <tr>
            <td>ASA</td>
            <td>{{ time(stats.cpt.asa) }}</td>
            <td>{{ time(group_stats.cpt.asa) }}</td>
          </tr>
        </tbody>
      </table>
    </b-col>
    <b-col>
      <table class="table table-striped table-sm">
        <caption>Agent metrics</caption>
        <thead class="thead-dark">
          <tr>
            <td></td>
            <td class="text-right">My</td>
            <td class="text-right">Group</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Occupancy</td>
            <td class="text-right">{{ percent(stats.occupancy.ratio.oncall) }}</td>
            <td class="text-right">{{ percent(group_stats.occupancy.ratio.oncall) }}</td>
          </tr>
          <tr>
            <td>Available</td>
            <td class="text-right">{{ percent(stats.occupancy.ratio.available) }}</td>
            <td class="text-right">{{ percent(group_stats.occupancy.ratio.available) }}</td>
          </tr>
          <tr>
            <td>Release</td>
            <td class="text-right">{{ percent(stats.occupancy.ratio.release) }}</td>
            <td class="text-right">{{ percent(group_stats.occupancy.ratio.release) }}</td>
          </tr>
        </tbody>
      </table>
    </b-col>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'agent-stats',
  data () {
    return {
      periods: [ "15m", "30m", "1h", "1w", "1m"],
      period: "15m",
      stats: {
        cpt: {},
        occupancy: {
          ratio: {}
        }
      },
      group_stats: {
        cpt: {},
        occupancy: {
          ratio: {}
        }
      }
    }
  },
  methods: {
    query: async function () {
      this.stats = await this.$agent.p_mfa('ws_stats', 'stats', [this.period])
      this.group_stats = await this.$agent.p_mfa('ws_stats', 'tagged_stats', [this.period])
    },
    group_query: async function () {
    },
    percent (value) {
      if (value > 0) {
        return `${(value*100).toFixed(2)}%`
      } else {
        return "0%"
      }
    },
    isActive (value) {
      return value == this.period
    },
    time (value) {
      if (value > 0) {
        return `${(value/1000).toFixed(1)}s`
      } else {
        return "0s"
      }
    },
    set_period (value) {
      this.period = value
      this.query()
    },
    handleUpdate () {
      this.query()
    },
  },
  created () {
    this.$bus.$on('agent_stats', this.handleUpdate)
    this.query()
    this.group_query()
  },
  beforeDestroy () {
    this.$bus.$off('agent_stats', this.handleUpdate)
  }
}
</script>
