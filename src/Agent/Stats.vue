<template>
  <div v-access:widget-my-statistics>
    <toggle-bar style="cursor: move" />
    <b-collapse
      id="collapseMyStatistics"
      v-model="showCollapse"
      class="mt-2 itemDragable"
    >
      <b-row style="margin-top:10px">
        <b-col sm="4">
          <b-form-select
            v-model="period.value"
            class="pointer"
            size="sm"
            @change="updateWidgets"
          >
            <option
              v-for="itemPeriod in periods"
              :key="itemPeriod.value"
              :value="itemPeriod.value"
            >
              {{ itemPeriod.name }}
            </option>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row style="margin-top:10px">
        <b-col
          cols="1"
          class="table-body-orange"
        >
          <ciq />
        </b-col>
        <b-col
          cols="1"
          class="table-body-green"
        >
          <count />
        </b-col>
        <b-col
          cols="1"
          style="padding-left:0; margin-right: 2px; padding-right: 0"
        >
          <states />
        </b-col>
        <b-col><agent :period="period.value" /></b-col>
        <b-col><group :period="period.value" /></b-col>
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
  widgetName: 'My statistics',
  name: 'MyStatistics',
  components: {
    ciq: CIQ,
    count: Count,
    group: Group,
    agent: Agent,
    states: States
  },
  mixins: [Common, Storage],
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
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    }
  },
  created () {
    this.maybeInitLocal().loadLocal('showCollapse')
  },
  methods: {
    updateWidgets (v) {
    }
  },
}
</script>

<style lang="scss">
.form-check {
  margin-bottom: unset;
}
</style>
