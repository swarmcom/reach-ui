<template>
<div>
  <div class="row">
    <div class="col"><h3>Outbounds</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="outgoings" :fields="fields">
    <template slot="time" slot-scope="data">
      {{data.item.time}}
    </template>
    <template slot="actions" slot-scope="data">
      <template v-if="data.item.state == 'oncall'">
        <b-button size="sm" variant="primary" @click="takeover(data.item)">Takeover</b-button>
        <b-button size="sm" variant="success" @click="spy(data.item)">Spy</b-button>
      </template>
      <b-button size="sm" variant="danger" @click="hangup(data.item)">Hangup</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  data () {
    return {
      fields: {
        state: { label: 'State', sortable: true },
        record: { label: 'Type', sortable: true },
        time: { label: 'Time', sortable: true },
        actions: { label: 'Actions' }
      },
      outgoings: [],
      updater: null
    }
  },
  methods: {
    handleState ({state}) {
      let i = this.outgoings.findIndex(E => E.id === state.id)
      if (i >= 0) {
        if (state.state === 'terminate') {
          this.outgoings.splice(i, 1)
        } else {
          this.outgoings.splice(i, 1, this.enrich_queue(state))
        }
      } else {
        this.outgoings.push(this.enrich_queue(state))
      }
    },
    enrich_queue (state) {
      state.time = Math.round(state.time/1000)
      return state
    },
    query: async function() {
      this.outgoings = await this.$agent.p_mfa('ws_admin', 'outgoings', ['all'])
      this.outgoings.forEach((inq) => {
        inq.time = Math.round(inq.time/1000)
      })
    },
    onTimer () {
      this.outgoings.forEach((E, i, Arr) => { 
        E.time = E.time + 1
        Arr.splice(i, 1, E)
      })
    },
    takeover ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'takeover', [record, uuid])
    },
    spy ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'spy', [record, uuid])
    },
    hangup ({id}) {
      this.$agent.p_mfa('ws_supervisor', 'hangup', ['outgoing', id])
    }
  },
  created () {
    this.query()
    this.$agent.subscribe('outgoings')
    this.$bus.$on('outgoing_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    this.$bus.$off('outgoing_state', this.handleState)
    clearInterval(this.updater)
  }
}
</script>
