<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Permissions:</h3></div></div>

  <div v-for="permission of permissions" class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(permission.id)" class="btn btn-outline-danger pointer"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control"
        :value="safe_value(permission.name)" v-on:change="onChange(permission, 'name', $event.target.value)">
    </div>
  </div>

  <div class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-outline-secondary pointer"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </div>
    <div class="col-4">
      <input type="text" class="form-control" v-model="name" placeholder="Name">
    </div>
  </div>

  <div v-for="perm of perms_check" class="form-row" style="margin-top: 5px">
    <b-form-checkbox v-model="perm.value" v-on:change="onChangeCheck(perm, $event)"
                     >
      {{perm.name}}
    </b-form-checkbox>
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
      permissions: [],
      perms_check: [{name: "admin-ui", value: false},
                    {name: "supervisor-ui", value: false},
                    {name: "profile-ui", value: false},
                    {name: "recording-ui", value: false}
      ]
    }
  },
  methods: {
    query: async function () {
      this.permissions = await this.$agent.p_mfa('ws_db_permission', 'get', [this.id])
        this.permissions.forEach( (key) =>
          {
            let i = this.perms_check.findIndex(E => E.name === key.name)
            if (i >= 0) {
              this.perms_check[i].value = true
              this.perms_check[i].id = key.id
            }
          }
        )
    },
    onChange (permission, field, value) {
      permission[field] = value
      this.$agent.p_mfa('ws_db_permission', 'update', [permission.id, permission])
    },
    onChangeCheck: async function(perm, checked) {
      if(checked) {
        let permission = await this.$agent.p_mfa('ws_db_permission', 'create', [this.id, {
            name: perm.name
        }])
        perm.id = permission.id
        this.permissions.push(permission)
      }
      else {
        await this.$agent.p_mfa('ws_db_permission', 'delete', [perm.id])
        let id = this.permissions.findIndex(Obj => Obj.id === perm.id)
        if (id >= 0) {
          this.permissions.splice(id, 1)
        }
      }
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
