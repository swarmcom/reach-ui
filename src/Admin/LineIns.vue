<template>
<div>
  <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
  <b-table striped hover small responsive :sort-by="sortBy" :items="line_ins" :fields="fields" @row-clicked="onClick">
  </b-table>
</div>
</template>

<script>
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'admin-line-ins',
  data () {
    return {
      fields: ['id', 'name', 'number', 'queue', 'client'],
      sortBy: 'id',
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
    'custom-table': CustomTable
  }
}
</script>