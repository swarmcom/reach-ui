<template>
  <div>
    <div class="row">
      <div class="col">
        <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
      </div>
      <div class="col-md-2 float-right">
        <b-form-select :options="pageOptions" v-model="perPage" />
      </div>
      <div class="col-md-4 float-right">
        <b-form-input v-model="filter" placeholder="Type to Filter" />
      </div>
    </div>
    <b-table style="margin-top:10px" striped hover small responsive
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by="sortBy"
      :items="agents"
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
        agent_id: { label: 'Id', sortable: true, tdClass:"pointer" },
        login: { label: 'Login', sortable: true, tdClass:"pointer"  },
        firstname: { label: 'First Name', sortable: true, tdClass:"pointer"  },
        lastname: { label: 'Last Name', sortable: true, tdClass:"pointer"  },
        permissions: { label: 'Permissions', sortable: true, tdClass:"pointer"  },
        group: { label: 'Group', sortable: true, tdClass:"pointer"  },
        uri: { label: 'Uri', sortable: true, tdClass:"pointer"  }
      },
      currentPage: 1,
      pageOptions: [
        {text:'All', value:0},
        {text:5,value:5},{text:10,value:10},{text:15,value:15}, {text:20,value:20}, {text:25,value:25}, {text:30,value:30}
      ],
      perPage: 0,
      filter: null,
      sortBy: 'agent_id',
      sortDesc: false,
      agents: [],
      groups: [],
      totalRows: 0
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_admin', 'get_profiles')
      let agents = await this.$agent.p_mfa('ws_admin', 'get_agents')
      agents.forEach( (agent) => agent.group = this.group(agent.group_id) )
      this.agents = agents
      this.totalRows = agents.length
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    group (Id) {
      let Group = this.groups.find(I => I.id == Id)
      return Group ? Group.name : ''
    },
    onClicked (data) {
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
}
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>