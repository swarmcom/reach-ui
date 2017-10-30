<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Permissions:</h3></div></div>

  <div v-for="permission of permissions" class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(permission.id)" class="btn btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control"
        :value="safe_value(permission.name)" v-on:change="onChange(permission, 'name', $event.target.value)">
    </div>
  </div>

  <div class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control" v-model="name" placeholder="Name">
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'admin-role-permissions',
  props: ['id'],
  data () {
    return {
      name: undefined,
      permissions: []
    }
  },
  methods: {
    query: async function () {
      this.permissions = await this.$agent.p_mfa('ws_db_permission', 'get', [this.id])
    },
    onChange (permission, field, value) {
      permission[field] = value
      this.$agent.p_mfa('ws_db_permission', 'update', [permission.id, permission])
    },
    add: async function() {
      let permission = await this.$agent.p_mfa('ws_db_permission', 'create', [this.id, {
        name: this.name
      }])
      this.permissions.push(permission)
      this.name = undefined
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_permission', 'delete', [Key])
      let id = this.permissions.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.permissions.splice(id, 1)
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
