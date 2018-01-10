<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><b-col><h3>Admins:</h3></b-col></b-row>

  <div v-for="admin of admins" :key="admin.id" style="margin-top: 5px">
    <admin :value="admin" v-on:change="change" v-on:del="del"></admin>
  </div>
  <admin :value="admin" style="margin-top: 5px" v-on:change="change_admin" v-on:add="add"></admin>

</div>
</template>

<script>
import Admin from '@/Kam/Admin'

export default {
  name: 'admin-kam-admins',
  components: { Admin },
  props: ['id'],
  data () {
    return {
      admin: {},
      admins: []
    }
  },
  methods: {
    query: async function () {
      this.admins = await this.$agent.p_mfa('ws_master', 'admins', [this.id])
    },
    change: async function (admin) {
      this.$agent.p_mfa('ws_master', 'update_admin', [this.id, admin.id, admin])
    },
    change_admin (admin) {
      this.admin = admin
    },
    add: async function(admin) {
      let created_admin = await this.$agent.p_mfa('ws_master', 'create_admin', [this.id, admin])
      this.admins.push(created_admin)
      this.admin = {}
    },
    del: async function (id) {
      await this.$agent.p_mfa('ws_master', 'delete_admin', [id])
      let idx = this.admins.findIndex(Obj => Obj.id === id)
      if (idx >= 0) {
        this.admins.splice(idx, 1)
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
