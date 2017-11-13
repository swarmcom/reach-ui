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
      <b-row>
        <b-col>Longest:</b-col>
        <b-col>{{ time(stats.cpt.longest) }}</b-col>
        <b-col>{{ time(group_stats.cpt.longest) }} </b-col>
      </b-row>
      <b-row>
        <b-col>CPT:</b-col>
        <b-col>{{ time(stats.cpt.cpt) }}</b-col>
        <b-col>{{ time(group_stats.cpt.cpt) }} </b-col>
      </b-row>
      <b-row>
        <b-col>ASA:</b-col>
        <b-col>{{ time(stats.cpt.asa) }}</b-col>
        <b-col>{{ time(stats.cpt.asa) }}</b-col>
      </b-row>
    </b-col>
    <b-col cols=2></b-col>
    <b-col>
      <b-row>
        <b-col>Occupancy:</b-col>
        <b-col class="text-right">{{ percent(stats.occupancy.ratio.oncall) }}</b-col>
        <b-col class="text-right">{{ percent(group_stats.occupancy.ratio.oncall) }}</b-col>
      </b-row>
      <b-row>
        <b-col>Available:</b-col>
        <b-col class="text-right">{{ percent(stats.occupancy.ratio.available) }}</b-col>
        <b-col class="text-right">{{ percent(group_stats.occupancy.ratio.available) }}</b-col>
      </b-row>
      <b-row>
        <b-col>Release:</b-col>
        <b-col class="text-right">{{ percent(stats.occupancy.ratio.release) }}</b-col>
        <b-col class="text-right">{{ percent(group_stats.occupancy.ratio.release) }}</b-col>
      </b-row>
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
    },
    group_query: async function () {
      this.group_stats = await this.$agent.p_mfa('ws_stats', 'tagged_stats', [this.period])
    },
    percent (value) {
      return `${(value*100).toFixed(2)}%`
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
    handleGroupUpdate () {
      this.group_query()
    }
  },
  created () {
    this.$bus.$on('agent_group_state', this.handleGroupUpdate)
    this.$bus.$on('agent_stats', this.handleUpdate)
    this.query()
    this.group_query()
  },
  beforeDestroy () {
    this.$bus.$off('agent_group_state', this.handleGroupUpdate)
    this.$bus.$off('agent_stats', this.handleUpdate)
  }
}
</script>
