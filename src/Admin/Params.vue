<template>
<div class="container">
  <div class="row"  style="margin-bottom: 20px">
    <div class="col">
      <h3>System-wide parameters:</h3>
    </div>
  </div>
  <div v-for="param of params" class="form-row">
    <div class="for_group col-1">
      <button @click="del(param.key)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
    </div>
    <div class="form-group col-3">
      <input type="text" class="form-control" v-model="param.key">
    </div>
    <div class="form-group col">
      <input type="text" class="form-control" v-model="param.value">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
    </div>
    <div class="form-group col-3">
      <input type="text" class="form-control" v-model="name">
    </div>
    <div class="form-group col">
      <input type="text" class="form-control" v-model="value">
    </div>
  </div>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-params',
  mixins: [Common],
  data () {
    return {
      params: [],
      name: '',
      value: ''
    }
  },
  methods: {
    query: async function () {
      let Params = await this.$agent.p_mfa('ws_admin', 'get_params')
      this.params = this.object2list(Params)
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
    onCommit: async function () {
      let Params = this.list2object(this.params)
      await this.$agent.p_mfa('ws_admin', 'set_params', [Params])
      this.$notify({ title: 'Success:', text: 'Parameters updated.', type: 'success' });
    },
  },
  created () {
    this.query()
  }
}
</script>
