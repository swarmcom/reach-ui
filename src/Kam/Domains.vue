<template>
  <div class="container">
    <b-row>
      <b-col>
        <b-btn
          class="pointer"
          title="Add Domain"
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
      :items="domains"
      :fields="fields"
    >
      <template
        slot="actions"
        slot-scope="data"
      >
        <b-btn
          size="sm"
          variant="primary"
          @click="edit(data.item)"
        >
          Edit
        </b-btn>
        <b-btn
          size="sm"
          variant="secondary"
          @click="dialplan(data.item)"
        >
          Dialplan
        </b-btn>
        <b-btn
          size="sm"
          variant="success"
          @click="admins(data.item)"
        >
          Admins
        </b-btn>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'AdminDomains',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      domains: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.domains = await this.$agent.p_mfa('ws_kam_domain', 'get')
    },
    add () {
      this.$router.push(`/kam/domain/`)
    },
    edit (data) {
      this.$router.push(`/kam/domain/${data.id}`)
    },
    nodes (data) {
      this.$router.push(`/kam/domain/${data.id}/nodes`)
    },
    dialplan (data) {
      this.$router.push(`/kam/domain/${data.id}/dialplan`)
    },
    admins (data) {
      this.$router.push(`/kam/domain/${data.id}/admins`)
    }
  }
}
</script>
