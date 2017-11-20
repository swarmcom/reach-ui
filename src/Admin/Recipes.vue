<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Recipes:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success pointer"><icon name="plus" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="recipes" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn class="pointer" size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn class="pointer" size="sm" variant="success" @click="entries(data.item)">Entries</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
import Btable from '../Widget/Btable'

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
      this.$router.push(`/admin/recipe/`)
    },
    edit (data) {
      this.$router.push(`/admin/recipe/${data.id}`)
    },
    entries (data) {
      this.$router.push(`/admin/recipe/${data.id}/entries`)
    }
  },
  created () {
    this.query()
  }
}
</script>
