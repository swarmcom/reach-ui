<template>
<b-form-row>
  <b-col cols="6">
    <b-form-select v-model="comparision" @change="commit" :options="comparasions"></b-form-select>
  </b-col>
  <b-col cols="6">
    <select class="custom-select" :value="value" @change="commit">
      <option></option>
      <option v-for="client in clients" :value="client.id">{{ client.name }}</option>
    </select>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-condition-client',
  props: ['args'],
  data () {
    return {
      comparasions: ['=', '!=' ],
      comparision: this.args[0],
      value: this.args[1],
      clients: []
    }
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
    },
    commit () {
      this.$emit('input', [this.comparision, this.value])
    }
  },
  watch: {
    comparision () {
      this.commit()
    },
    value () {
      this.commit()
    }
  },
  created () {
    this.query()
  },
}
</script>
