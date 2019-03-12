<template>
<div>
  <b-row>
    <b-col>
      <b-btn class="pointer" title="Add Recipe" variant="outline-success" @click="add"><icon name="plus" class="align-middle" scale="1"></icon></b-btn>
    </b-col>
  </b-row>
  <b-table style="margin-top:10px" striped hover small :items="recipes" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn class="pointer" size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn class="pointer" size="sm" variant="success" @click="entries(data.item)">Entries</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  name: 'admin-recipes',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: { lavel: 'Actions' }
      },
      recipes: []
    }
  },
  methods: {
    query: async function () {
      this.recipes = await this.$agent.p_mfa('ws_db_recipe', 'get')
    },
    add () {
      this.$router.push(`/recipe/`)
    },
    edit (data) {
      this.$router.push(`/recipe/${data.id}`)
    },
    entries (data) {
      this.$router.push(`/recipe/${data.id}/entries`)
    }
  },
  created () {
    this.query()
  }
}
</script>
