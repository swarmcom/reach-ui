<template>
  <div>
    <b-row>
      <b-col>
        <h3>Domain parameters:</h3>
      </b-col>
    </b-row>
    <div
      v-for="param of params"
      :key="param.key"
      class="form-row"
      style="margin-top: 5px"
    >
      <b-col cols="3">
        <input
          v-model="param.key"
          type="text"
          class="form-control"
          readonly
        >
      </b-col>
      <b-col>
        <input
          v-model="param.value"
          type="text"
          class="form-control"
        >
      </b-col>
    </div>

    <b-row style="margin-top: 20px">
      <b-col>
        <b-btn
          class="pointer"
          variant="primary"
          @click="commit"
        >
          Commit
        </b-btn>
        <b-btn
          class="pointer"
          variant="outline-primary"
          @click="cancel"
        >
          Cancel
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'AdminParams',
  mixins: [Common],
  data () {
    return {
      config_file: undefined,
      params: [],
      name: '',
      value: ''
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      let Params = await this.$agent.p_mfa('ws_admin', 'get_params')
      this.params = this.object2list(Params).sort( (a,b) => a.key.localeCompare(b.key) )
    },
    add () {
      this.params.push({ key: this.name, value: this.value })
      this.name = ''
      this.value = ''
    },
    del (Key) {
      let id = this.params.findIndex(Obj => Obj.key === Key)
      if (id >= 0) {
        this.params.splice(id, 1)
      }
    },
    commit: async function () {
      let Params = this.list2object(this.params)
      await this.$agent.p_mfa('ws_admin', 'set_params', [Params])
      this.$notify({ title: 'Success:', text: 'Parameters updated.', type: 'success' });
    },
    cancel: async function () {
      this.$router.push('/agents')
    },
  }
}
</script>
