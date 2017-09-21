<template>
<div>
  <btable
    :fields="fields"
    :data="line_ins"
    :storageName="name"
    :add_button=true>
  </btable>
</div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-line-ins',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        number: { label: 'Number', sortable: true },
        queue: { label: 'Queue', sortable: true },
        client: { label: 'Client', sortable: true }
      },
      name: "adminLineIns",
      line_ins: [],
      queues: []
    }
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_admin', 'get_queues')
      this.clients = await this.$agent.p_mfa('ws_admin', 'get_clients')
      let line_ins = await this.$agent.p_mfa('ws_admin', 'get_line_ins')
      line_ins.forEach( (line) => {
        line.queue = this.queue(line.queue_id)
        line.client = this.client(line.client_id)
      })
      this.line_ins = line_ins
    },
    add () {
      this.$router.push(`/admin/line_in/`)
    },
    onClick (data) {
      console.log(data)
      this.$router.push(`/admin/line_in/${data.id}`)
    },
    queue (Id) {
      let Queue = this.queues.find(I => I.id == Id)
      return Queue ? Queue.name : Id
    },
    client (Id) {
      let Client = this.clients.find(I => I.id == Id)
      return Client ? Client.name : Id
    }
  },
  created () {
    this.query()
  },
  components: {
   'btable': Btable
  }
}
</script>