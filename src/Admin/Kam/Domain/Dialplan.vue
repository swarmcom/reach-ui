<template>
<b-container>
  <b-row style="margin-bottom: 10px">
    <b-col><h3>Domain dialplan:</h3></b-col>
  </b-row>

  <div v-for="entry of entries" :key="entry.id" style="margin-top: 5px">
    <entry :id="id" :value="entry" v-on:change="change" v-on:up="up" v-on:down="down" v-on:del="del"></entry>
  </div>
  <entry :id="id" :value="entry" style="margin-top: 5px" v-on:change="change_entry" v-on:add="add"></entry>
</b-container>
</template>

<script>
import Entry from '@/Admin/Kam/Domain/Dialplan/Entry'

export default {
  name: 'admin-domain-dialplan',
  props: ['id'],
  components: { Entry },
  data () {
    return {
      entry: {},
      entries: []
    }
  },
  methods: {
    query: async function () {
      this.entries = await this.$agent.p_mfa('ws_kam_dialplan_in', 'get', [this.id])
    },
    change: async function (entry) {
      this.$agent.p_mfa('ws_kam_dialplan_in', 'update', [entry.id, entry])
    },
    change_entry (entry) {
      this.entry = entry
    },
    up: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_kam_dialplan_in', 'up', [id+""])
    },
    down: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_kam_dialplan_in', 'down', [id+""])
    },
    add: async function() {
      let entry = await this.$agent.p_mfa('ws_kam_dialplan_in', 'create', [this.id, this.entry])
      this.entries.push(entry)
      this.entry = {}
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_kam_dialplan_in', 'delete', [Key])
      let id = this.entries.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.entries.splice(id, 1)
      }
    }
  },
  created () {
    this.query()
  },
}
</script>
