<template>
<div>
  <div class="row">
    <div class="col"><h3>Live calls in queue</h3></div>
  </div>
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

export default {
  mixins: [Base],
  name: 'live-inbounds-monitor',
  components: {
  },
  data () {
    return {
      fields: {
        state: { label: 'State' },
        record: { label: 'Type' },
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
      let i = this.data.findIndex(E => E.uuid === state.uuid && E.record === state.record)
      if (state.state === 'terminate') {
        if (i >= 0) {
          this.data.splice(i, 1)
        }
      } else {
        if (i >= 0) {
          this.data.splice(i, 1, state)
        } else {
          this.data.push(state)
        }
      }
    },
    query: async function (type) {
      this.data = await this.$agent.p_mfa('ws_live', 'inbounds')
      await this.$agent.p_mfa('ws_live', 'subscribe', ['inbounds'])
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
  },
  created () {
    this.$bus.$on('live_inqueue_state', this.handleState)
    this.$bus.$on('live_inqueue_vm_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('live_inqueue_state', this.handleState)
    this.$bus.$off('live_inqueue_vm_state', this.handleState)
    this.$agent.p_mfa('ws_live', 'unsubscribe', ['inbounds'])
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['inbounds'])
      this.query(value)
    },
  }
}
</script>
