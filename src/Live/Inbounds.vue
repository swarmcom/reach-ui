<template>
<div>
  <div class="row">
    <div class="col"><h3>Live inbound calls for {{type}}</h3></div>
  </div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" />
    </b-col>
  </b-row>
  <b-table style="margin-top:10px" small striped hover :items="inqueues" :fields="fields">
    <template slot="twe" slot-scope="data">
      {{data.item.time}} {{data.item.weight}} {{data.item.effective}}
    </template>
    <template slot="skills" slot-scope="data">
      {{data.item.skills}}
    </template>
    <template slot="actions" slot-scope="data">
      <template v-if="data.item.state == 'oncall'">
        <b-button size="sm" variant="primary" @click="takeover(data.item)">Takeover</b-button>
        <b-button size="sm" variant="success" @click="spy(data.item)">Spy</b-button>
      </template>
      <template v-if="data.item.state == 'inqueue' || data.item.state == 'agent'">
        <b-button size="sm" variant="primary" @click="take(data.item)">Take</b-button>
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
      type: 'skills',
      types: ['skills'],
      fields: {
        state: { label: 'State', sortable: true },
        record: { label: 'Type', sortable: true },
        queue: { label: 'Queue', sortable: true },
        skills: { label: 'Skills' },
        twe: { label: 'T.W.E.', sortable: true },
        actions: { label: 'Actions' }
      },
      inqueues: [],
      queues: [],
      updater: null
    }
  },
  methods: {
    handleState ({info}) {
      let i = this.inqueues.findIndex(E => E.uuid === info.uuid)
      if (i >= 0) {
        if (info.state === 'terminate') {
          this.inqueues.splice(i, 1)
        } else {
          this.inqueues.splice(i, 1, this.enrich_queue(info))
        }
      } else {
        this.inqueues.push(this.enrich_queue(info))
      }
    },
    query: async function() {
      this.data = await this.$agent.p_mfa('ws_live', 'inbounds')
    },
    onTimer () {
      this.data.forEach((E, i, Arr) => { 
        E.time = E.time + 1
        E.effective = E.effective + 1
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
    }
  },
  created () {
    this.query()
    this.$bus.$on('inqueue_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    this.$bus.$off('inqueue_state', this.handleState)
    clearInterval(this.updater)
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['inbounds', old])
      this.query(value)
    }
  }
}
</script>
