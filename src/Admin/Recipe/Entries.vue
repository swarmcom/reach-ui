<template>
<div>
  <div class="row"><div class="col"><h3>Recipe entries:</h3></div></div>
  <b-row style="margin-bottom: 20px">
    <b-col>
      <button @click="enable_edit()" class="btn btn-outline-primary">Show</button>
      <button @click="hide_edit()" class="btn btn-outline-primary">Hide</button>
    </b-col>
  </b-row>

  <div class="row" v-for="entry of entries" :key="entry.id">
    <div class="container">
      <b-row>
        <b-col cols=1>
          <button @click="del(entry.id)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
        </b-col>
        <b-col cols="6">
          <conditions :value="entry.conditions" :edit="edit" @input="update_condition(entry.id, $event)"></conditions>
        </b-col>
        <b-col cols="5">
          <actions :value="entry.actions" :edit="edit" @input="update_action(entry.id, $event)"></actions>
        </b-col>
      </b-row>
    </div>
  </div>

  <div class="row">
    <div class="container">
      <b-row>
        <b-col cols=1>
          <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
        </b-col>
        <b-col cols="6">
          <conditions :value="conditions" @input="set_conditions($event)"></conditions>
        </b-col>
        <b-col cols="5">
          <actions :value="actions" @input="set_actions($event)"></actions>
        </b-col>
      </b-row>
    </div>
  </div>
</div>
</template>

<script>
import Conditions from './Conditions'
import Actions from './Actions'

export default {
  name: 'admin-recipe-entries',
  props: ['id'],
  components: {
    conditions: Conditions,
    actions: Actions,
  },
  data () {
    return {
      edit: false,
      conditions: [],
      actions: [],
      entries: []
    }
  },
  methods: {
    query: async function () {
      this.entries = await this.$agent.p_mfa('ws_db_recipe_entry', 'get', [this.id])
    },
    set_conditions (value) {
      this.conditions = value
    },
    enable_edit (index) {
      this.edit = true
    },
    hide_edit (index) {
      this.edit = false
    },
    update_condition (index, value) {
      let id = this.entries.findIndex(Obj => Obj.id === index)
      let entry = this.entries[id]
      entry.conditions = value
      this.$agent.p_mfa('ws_db_recipe_entry', 'update', [entry.id, entry])
    },
    update_action (index, value) {
      let id = this.entries.findIndex(Obj => Obj.id === index)
      let entry = this.entries[id]
      entry.actions = value
      this.$agent.p_mfa('ws_db_recipe_entry', 'update', [entry.id, entry])
    },
    set_actions (value) {
      this.actions = value
    },
    add: async function() {
      let recipe = await this.$agent.p_mfa('ws_db_recipe_entry', 'create', [this.id, {
        conditions: this.conditions, actions: this.actions
      }])
      this.entries.push(recipe)
      this.actions = []
      this.conditions = []
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_recipe_entry', 'delete', [Key])
      let id = this.entries.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.entries.splice(id, 1)
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
