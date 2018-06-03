<template>
<div v-access:widget-my-statistics>
  <toggle-bar style="cursor: move"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseMyStatistics" class="mt-2 itemDragable">
    <b-row style="margin-top:10px">
      <b-col sm="4">
        <b-form-select class="pointer" size="sm" v-model="period.value" @change="set_period">
          <option v-for="period in periods" :value="period.value" :key="period.name">{{period.name}}</option>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row style="margin-top:10px">
      <b-col style="padding:0; max-width: 60px !important"><ciq class="table-body-orange"></ciq></b-col>
      <b-col style="padding:0; max-width: 60px !important"><count class="table-body-green"></count></b-col>
      <b-col style="padding:0; max-width: 102px !important; padding-right:10px; border-right: 2px solid white;"><states></states></b-col>
      <b-col><agent @period=period></agent></b-col>
      <b-col><group @period=period></group></b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import CIQ from '@/Agent/Stats/CIQ'
import Count from '@/Agent/Stats/Count'
import Group from '@/Agent/Stats/Group'
import Agent from '@/Agent/Stats/Agent'
import States from '@/Agent/Stats/States'
import Storage from '@/Storage'

export default {
  name: 'my-statistics',
  mixins: [Common, Storage],
  components: {
    ciq: CIQ,
    count: Count,
    group: Group,
    agent: Agent,
    states: States
  },
  data () {
    return {
      period: {value: "15m", name: "Last 15 minutes"},
      periods: [
        {value: "15m", name: "Last 15 minutes"},
        {value: "30m", name: "Last 30 minutes"},
        {value: "1h", name: "Last Hour"},
        {value: "1d", name: "Today"},
        {value: "1w", name: "This Week"},
        {value: "1M", name: "This Month"}
      ],
      showCollapse: true
    }
  },
  methods: {
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    }
  },
}
</script>

<style lang="scss">
.form-check {
  margin-bottom: unset;
}
</style>
