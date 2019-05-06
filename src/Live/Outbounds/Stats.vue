<template>
  <div>
    <b-row>
      <b-col>
        <h6>
          Outbounds stats by {{ type }}
        </h6>
      </b-col>
    </b-row>
    <b-row
      v-if="visible"
      style="margin-bottom: 10px"
    >
      <b-col cols="3">
        <b-form-select
          v-model="type"
          :options="types"
          size="sm"
        />
      </b-col>
      <b-col cols="3">
        <b-form-select
          v-model="period"
          :options="periods"
          size="sm"
        />
      </b-col>
    </b-row>
    <b-table
      v-if="visible"
      style="margin-top:10px"
      small
      bordered
      hover
      head-variant="light"
      thead-tr-class="table-header"
      tbody-tr-class="table-body"
      sort-by="entity"
      :items="data"
      :fields="fields"
    >
      <template
        slot="entity"
        slot-scope="data"
      >
        {{ data.item.entity.name }}
      </template>
      <template
        slot="agent_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.agent_time) }}
      </template>
      <template
        slot="avg_agent_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.avg_agent_time) }}
      </template>
      <template
        slot="calling_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.calling_time) }}
      </template>
      <template
        slot="avg_calling_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.avg_calling_time) }}
      </template>
      <template
        slot="talk_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.talk_time) }}
      </template>
      <template
        slot="avg_talk_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.avg_talk_time) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  name: 'LiveOutboundsStats',
  components: {
  },
  mixins: [Base],
  data () {
    return {
      visible: true,
      type: 'group',
      types: ['group', 'acl', 'client', 'line'],
      period: '15m',
      periods: [
        { value:'15m', text:'Last 15 minutes' },
        { value:'30m', text:'Last 30 minutes' },
        { value:'1h', text:'Last hour' },
        { value:'1d', text:'Today' },
        { value:'1w', text:'This Week' },
        { value:'1M', text:'This Month' }
      ],
      fields: {
        entity: { label: 'Name' },
        calls: { label: 'Calls' },
        rings: { label: 'Rings' },
        answers: { label: 'Answers' },
        calling_abandons: { label: 'Calling fail', sortable: true },
        agent_abandons: { label: 'Agents fail', sortable: true },
        calling_time: { label: 'Calling', sortable: true },
        avg_calling_time: { label: 'Avg.Calling', sortable: true },
        agent_time: { label: 'Agent', sortable: true },
        avg_agent_time: { label: 'Avg.Agent', sortable: true },
        talk_time: { label: 'Talk', sortable: true },
        avg_talk_time: { label: 'Avg.Talk', sortable: true }
      },
    }
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['outbound_groups', old])
      this.query(value, this.period)
    },
    period: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['outbound_groups', this.type])
      this.query(this.type, value)
    }
  },
  created () {
    this.loadCache()
    this.$bus.$on('live_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['outbound_groups', this.type])
    this.$bus.$off('live_stats', this.handleStats)
  },
  methods: {
    handleStats ({stats, type}) {
      switch (type) {
        case 'outgoing_acl_group':
        case 'outgoing_client':
        case 'outgoing_line_out':
        case 'outgoing_agent_group':
          this.data = stats
          break
        default:
          break
      }
    },
    query: async function (type, period) {
      await this.$agent.p_mfa('ws_live_stats', 'subscribe', ['outbound_groups', type, period])
      this.saveCache()
    },
    onTimer () {
    },
  }
}
</script>
