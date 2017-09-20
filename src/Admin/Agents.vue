<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <div class="my-1 row">
      <div class="col-md-6">
        <b-form-fieldset horizontal label="Rows per page" :label-cols="6">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-fieldset>
      </div>
      <div class="col-md-6">
        <b-form-fieldset horizontal label="Filter" :label-cols="3">
          <b-form-input v-model="filter" placeholder="Type to Search" />
        </b-form-fieldset>
      </div>
    </div>
    <b-table striped hover small responsive
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by="sortBy"
      :items="computedAgents"
      :fields="fields"
      :filter="filter"
      :sortDesc="sortDesc"
      @row-clicked="onClicked"
      @filtered="onFiltered">
    </b-table>
    <b-pagination align="center" v-if="perPage > 0" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
  </div>
</template>

<script>

export default {
  name: 'admin-agents',
  data () {
    return {
      fields: {
        agent_id:     { label: 'Id', sortable: true },
        login:      { label: 'Login', sortable: true  },
        firstname: { label: 'First Name', sortable: true  },
        lastname:  { label: 'Last Name', sortable: true  },
        permissions: { label: 'Permissions', sortable: true  },
        group_id: { label: 'Profile', sortable: true  },
        uri: { label: 'Uri', sortable: true  }
      },
      currentPage: 1,
      pageOptions: [{text:'All', value:0},{text:5,value:5},{text:10,value:10},{text:15,value:15}, {text:20,value:20}, {text:25,value:25}, {text:30,value:30}],
      perPage: 0,
      filter: null,
      sortBy: 'agent_id',
      sortDesc: false,
      agents: [],
      profiles: [],
      totalRows: 0
    }
  },
  methods: {
    query: async function () {
      this.profiles = await this.$agent.p_mfa('ws_admin', 'get_profiles')
      this.agents = await this.$agent.p_mfa('ws_admin', 'get_agents')
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    profile_name (Id) {
      let Profile = this.profiles.find(I => I.id == Id)
      return Profile ? Profile.name : ''
    },
    onClicked(data) {
      this.$router.push(`/admin/agent/${data.agent_id}`)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  created () {
    this.query()
  },
  computed: {
    computedAgents () {
      let agents = this.agents
      let profiles = this.profiles
      agents.forEach(function (key) {
        let Profile = profiles.find(I => I.id == key.group_id)
        Profile ? key.group_id = Profile.name : key.group_id = ''
      })
      this.totalRows = agents.length;
      return agents;
    }
  }
}
</script>