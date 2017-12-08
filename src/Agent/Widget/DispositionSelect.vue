<template>
<div>
  <b-form-select size="sm" v-model="selected" v-for @input="disposition" :disabled="isDisabled()" >
    <option :value="null" disabled>Disposition</option>
    <option v-for="r in dispositions" :key="r.id" :value="r.id">{{r.name}}</option>
  </b-form-select>
</div>
</template>

<script>
export default {
  name: 'agent-disposition-select',
  props: ['uuid'],
  data () {
    return {
      dispositions: [],
      selected: null,
      inqueue: {}
    }
  },
  methods: {
    isDisabled() {
      return this.dispositions.length == 0
    },
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_agent', 'dispositions', [this.uuid])
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
      if (this.inqueue.disposition_id != "undefined")
        this.selected = this.inqueue.disposition_id
    },
    disposition (id) {
      this.$agent.p_mfa('ws_agent', 'disposition', [this.uuid, id])
    },
  },
  created () {
    this.query()
  }
}
</script>
