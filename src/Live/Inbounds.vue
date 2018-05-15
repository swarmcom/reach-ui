<template>
<div>
  <div class="row">
    <div class="col"><h3>Live inbound calls</h3></div>
  </div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" />
    </b-col>
  </b-row>
  <b-row v-if="widget('queues')" style="margin-bottom: 10px">
    <b-col>
      <widget-queues v-model="queues"></widget-queues>
    </b-col>
  </b-row>
  <b-row v-if="widget('queue_groups')" style="margin-bottom: 10px">
    <b-col>
      <widget-queue-groups v-model="queue_groups"></widget-queue-groups>
    </b-col>
  </b-row>
  <b-row v-if="widget('clients')" style="margin-bottom: 10px">
    <b-col>
      <widget-clients v-model="clients"></widget-clients>
    </b-col>
  </b-row>
  <b-row v-if="widget('line_ins')" style="margin-bottom: 10px">
    <b-col>
      <widget-line-ins v-model="line_ins"></widget-line-ins>
    </b-col>
  </b-row>
  <b-table style="margin-top:10px" small striped hover :items="data" :fields="fields">
    <template slot="time" slot-scope="data">
      {{durationFormatter(data.item.time)}}
    </template>
    <template slot="effective_time" slot-scope="data">
      {{data.item.effective_time.weight}} | {{durationFormatter(data.item.effective_time.time)}}
    </template>
    <template slot="queue" slot-scope="data">
      {{data.item.queue.name}}
    </template>
    <template slot="skills" slot-scope="data">
      {{data.item.skills}}
    </template>
    <template slot="actions" slot-scope="data">
      <template v-if="data.item.state == 'oncall'">
        <b-button size="sm" variant="primary" @click="takeover(data.item)" class="pointer">Takeover</b-button>
        <b-button size="sm" variant="success" @click="spy(data.item)" class="pointer">Spy</b-button>
      </template>
      <template v-if="data.item.state == 'inqueue' || data.item.state == 'agent'">
        <b-button size="sm" variant="primary" @click="take(data.item)" class="pointer">Take</b-button>
      </template>
      <b-button size="sm" variant="danger" @click="hangup(data.item)" class="pointer">Hangup</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'
import Queues from '@/Report/Widget/Queues'
import QueueGroups from '@/Report/Widget/QueueGroups'
import Clients from '@/Report/Widget/Clients'
import LineIns from '@/Report/Widget/LineIns'

export default {
  mixins: [Base],
  components: {
    'widget-queues': Queues,
    'widget-queue-groups': QueueGroups,
    'widget-clients': Clients,
    'widget-line-ins': LineIns
  },
  data () {
    return {
      type: 'skills',
      types: ['skills', 'queues', 'queue_groups', 'clients', 'line_ins'],
      queues: [],
      queue_groups: [],
      clients: [],
      line_ins: [],
      fields: {
        state: { label: 'State' },
        time: { label: 'Time' },
        effective_time: { label: 'Eff.' },
        queue: { label: 'Queue' },
        skills: { label: 'Skills' },
        actions: { label: 'Actions' }
      },
    }
  },
  methods: {
    handleState ({state}) {
      let i = this.data.findIndex(E => E.uuid === state.uuid)
      if (i >= 0) {
        if (state.state === 'terminate') {
          this.data.splice(i, 1)
        } else {
          this.data.splice(i, 1, state)
        }
      } else {
        this.data.push(state)
      }
    },
    query: async function (type) {
      this.data = await this.$agent.p_mfa('ws_live', 'inbounds', [type, this.widget_args(type)])
      await this.$agent.p_mfa('ws_live', 'subscribe', ['inbounds', type, this.widget_args(type)])
    },
    onTimer () {
      this.data.forEach((E, i, Arr) => { 
        E.time = E.time + 1000
        E.effective_time.time = E.effective_time.time + 1000
        Arr.splice(i, 1, E)
      })
    },
    take ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'take', [record, uuid])
    },
    takeover ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'takeover', [record, uuid])
    },
    spy ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'spy', [record, uuid])
    },
    hangup ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'hangup', [record, uuid])
    },
    widget (type) {
      return type == this.type
    },
    widget_args (type) {
      switch (type) {
        case 'queues': return this.queues
        case 'queue_groups': return this.queue_groups
        case 'clients': return this.clients
        case 'line_ins': return this.line_ins
        default: return []
      }
    }
  },
  created () {
    this.query(this.type)
    this.$bus.$on('live_inqueue_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('live_inqueue_state', this.handleState)
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['inbounds', old, this.widget_args(old)])
      this.query(value)
    }
  }
}
</script>
