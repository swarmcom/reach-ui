<template>
  <div>
    <b-row>
      <b-col>
        <b-btn
          class="pointer"
          title="Add Role"
          variant="outline-success"
          @click="add"
        >
          <icon
            name="plus"
            class="align-middle"
            scale="1"
          />
        </b-btn>
      </b-col>
    </b-row>
    <b-table
      style="margin-top:10px"
      striped
      hover
      small
      :items="roles"
      :fields="fields"
    >
      <template
        slot="actions"
        slot-scope="data"
      >
        <b-btn
          class="pointer"
          size="sm"
          variant="primary"
          @click="edit(data.item)"
        >
          Edit
        </b-btn>
        <b-btn
          v-if="data.item.name !== 'Admin'"
          class="pointer"
          size="sm"
          variant="success"
          @click="permissions(data.item)"
        >
          Permissions
        </b-btn>
      </template>
    </b-table>
  </div>
</template>

<script>

export default {
  name: 'AdminRoles',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      roles: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.roles = await this.$agent.p_mfa('ws_db_role', 'get')
    },
    add () {
      this.$router.push(`/role/`)
    },
    edit (data) {
      this.$router.push(`/role/${data.id}`)
    },
    permissions (data) {
      this.$router.push(`/role/${data.id}/permissions/${data.ui}`)
    }
  }
}
</script>
