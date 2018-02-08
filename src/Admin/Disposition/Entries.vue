<template>
<div>
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Dispositions:</h3></div></div>

  <div v-for="disposition of dispositions" class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(disposition.id)" class="btn btn-outline-danger pointer"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control"
        :value="safe_value(disposition.name)" v-on:change="onChange(disposition, 'name', $event.target.value)">
    </div>
    <div class="col-5">
      <input type="text" class="form-control"
        :value="safe_value(disposition.description)" v-on:change="onChange(disposition, 'description', $event.target.value)">
    </div>
  </div>

  <div class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-outline-secondary pointer"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control" v-model="name" placeholder="Name">
    </div>
    <div class="col-5">
      <input type="text" class="form-control" v-model="description" placeholder="Description">
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'admin-disposition-entries',
  props: ['id'],
  data () {
    return {
      name: undefined,
      description: undefined,
      dispositions: []
    }
  },
  methods: {
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_db_disposition', 'get', [this.id])
    },
    onChange (disposition, field, value) {
      disposition[field] = value
      this.$agent.p_mfa('ws_db_disposition', 'update', [disposition.id, disposition])
    },
    add: async function() {
      let disposition = await this.$agent.p_mfa('ws_db_disposition', 'create', [this.id, {
        name: this.name, description: this.description
      }])
      this.dispositions.push(disposition)
      this.name = undefined
      this.description = undefined
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_disposition', 'delete', [Key])
      let id = this.dispositions.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.dispositions.splice(id, 1)
      }
    },
    safe_value (Value) {
      return Value === 'undefined' ? '' : Value
    }
  },
  created () {
    this.query()
  }
}
</script>
