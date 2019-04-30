<template>
  <div class="container">
    <b-row style="margin-bottom: 10px">
      <b-col><h3>Admins:</h3></b-col>
    </b-row>

    <div
      v-for="itemAdmin of admins"
      :key="itemAdmin.id"
      style="margin-top: 5px"
    >
      <admin
        :value="itemAdmin"
        @change="change"
        @del="del"
      />
    </div>
    <admin
      :value="admin"
      style="margin-top: 5px"
      @change="change_admin"
      @add="add"
    />
  </div>
</template>

<script>
import Admin from '@/Kam/Admin'

export default {
  name: 'AdminKamAdmins',
  components: { Admin },
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      admin: {},
      admins: []
    }
  },
  created () {
    this.query()
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
  }
}
</script>
