<template>
<div>
  <div class="row"><div class="col"><h3>Recipe entries:</h3></div></div>
  <b-row style="margin-bottom: 20px">
    <b-col>
      <button @click="enable_edit()" class="btn btn-outline-primary">Show</button>
      <button @click="hide_edit()" class="btn btn-outline-primary">Hide</button>
    </b-col>
  </b-row>

  <b-row v-for="entry of entries" :key="entry.id" style="margin-bottom: 10px">
    <b-col cols=2>
      <button @click="del(entry.id)" class="btn btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
      &nbsp;
      <button @click="up(entry.id)" class="btn btn-outline-success"><icon class="align-middle" name="arrow-up" scale="1"></icon></button>
      <button @click="down(entry.id)" class="btn btn-outline-primary"><icon class="align-middle" name="arrow-down" scale="1"></icon></button>
    </b-col>
    <b-col cols=10 style="margin-bottom: 10px">
      <b-form-input v-model="entry.description" @input="update_description(entry.id, $event)"></b-form-input>
    </b-col>
    <b-col cols="6">
      <conditions :value="entry.conditions" :edit="edit" @input="update_condition(entry.id, $event)"></conditions>
    </b-col>
    <b-col cols="6">
      <actions :value="entry.actions" :edit="edit" @input="update_action(entry.id, $event)"></actions>
    </b-col>
  </b-row>

  <b-row>
    <b-col cols=1>
      <button @click="add" class="btn btn-outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </b-col>
    <b-col cols=11 style="margin-bottom: 10px">
      <b-form-input v-model="description"></b-form-input>
    </b-col>
    <b-col cols="6">
      <conditions :value="conditions" @input="set_conditions($event)"></conditions>
    </b-col>
    <b-col cols="6">
      <actions :value="actions" @input="set_actions($event)"></actions>
    </b-col>
  </b-row>
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
      description: '',
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
    up: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_db_recipe_entry', 'up', [id])
    },
    down: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_db_recipe_entry', 'down', [id])
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
    update_description (index, value) {
      let id = this.entries.findIndex(Obj => Obj.id === index)
      let entry = this.entries[id]
      entry.description = value
      this.$agent.p_mfa('ws_db_recipe_entry', 'update', [entry.id, entry])
    },
    set_actions (value) {
      this.actions = value
    },
    add: async function() {
      let recipe = await this.$agent.p_mfa('ws_db_recipe_entry', 'create', [this.id, {
        conditions: this.conditions, actions: this.actions, description: this.description
      }])
      this.entries.push(recipe)
      this.description = ''
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
