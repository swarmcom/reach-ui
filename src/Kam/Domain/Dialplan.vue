<template>
  <b-container>
    <b-row style="margin-bottom: 10px">
      <b-col><h3>Domain dialplan:</h3></b-col>
    </b-row>

    <div
      v-for="itemEntry of entries"
      :key="itemEntry.id"
      style="margin-top: 5px"
    >
      <entry
        :id="id"
        :value="itemEntry"
        @change="change"
        @up="up"
        @down="down"
        @del="del"
      />
    </div>
    <entry
      :id="id"
      :value="entry"
      style="margin-top: 5px"
      @change="change_entry"
      @add="add"
    />
  </b-container>
</template>

<script>
import Entry from '@/Kam/Domain/Dialplan/Entry'

export default {
  name: 'AdminDomainDialplan',
  components: { Entry },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      entry: {},
      entries: []
    }
  },
  created () {
    this.query()
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
}
</script>
