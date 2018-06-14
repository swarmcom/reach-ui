<template>
<div>
  <div class="row">
    <div class="col">
      <h3>Domain parameters:</h3>
    </div>
  </div>
  <div v-for="param of params" class="form-row" style="margin-top: 5px">
    <div class="col-3">
      <input type="text" class="form-control" v-model="param.key" readonly>
    </div>
    <div class="col">
      <input type="text" class="form-control" v-model="param.value">
    </div>
  </div>

  <b-row style="margin-top: 20px">
    <b-col>
      <button @click="commit" class="btn btn-primary pointer">Commit</button>
      <button @click="cancel" class="btn btn-outline-primary pointer">Cancel</button>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'admin-params',
  mixins: [Common],
  data () {
    return {
      config_file: undefined,
      params: [],
      name: '',
      value: ''
    }
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
  },
  created () {
    this.query()
  }
}
</script>
