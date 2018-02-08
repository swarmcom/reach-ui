<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><b-col><h3>Access Lists:</h3></b-col></b-row>
  <b-row><b-col><h3>Queues:</h3></b-col></b-row>
  <b-row><b-col><queues v-model="queues" @add="set('queue', $event)" @remove="unset('queue', $event)"></queues></b-col></b-row>
  
  <b-row style="margin-top: 20px"><b-col><h3>Clients:</h3></b-col></b-row>
  <b-row><b-col><clients v-model="clients" @add="set('client', $event)" @remove="unset('clients', $event)"></clients></b-col></b-row>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import Queues from '@/Admin/ACL/Queues'
import Clients from '@/Admin/ACL/Clients'

export default {
  name: 'admin-agent-group-acl',
  mixins: [Common],
  components: {
    'queues': Queues,
    'clients': Clients
  },
  props: ['id'],
  data () {
    return {
      acl: {},
      module: 'ws_db_acl',
      queues: [],
      clients: []
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.acl = await this.$agent.p_mfa('ws_db_acl', 'get', [this.id])
        this.queues = this.acl.queue? this.acl.queue : []
        this.clients = this.acl.client? this.acl.client : []
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
    set: async function (Record, Obj) {
      await this.$agent.p_mfa('ws_db_acl', 'set', [Record, Obj.id, this.id])
    },
    unset: async function (Record, Obj) {
      await this.$agent.p_mfa('ws_db_acl', 'delete', [Record, Obj.id, this.id])
    }
  },
  created () {
    this.query()
  }
}
</script>
