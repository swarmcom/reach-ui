<template>
<div>
  <div class="row"><div class="col"><h3>Recipe entries:</h3></div></div>

  <div class="row" v-for="entry of entries" :key="entry.id" style="margin-bottom: 10px">
    <div class="container">
      <b-row>
        <b-col cols=1>
          <button @click="del(entry.id)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
        </b-col>
      </b-row>
      <b-row style="margin-top: 10px">
        <b-col>
          <conditions :value="entry.conditions" @input="update_condition(entry.id, $event)"></conditions>
        </b-col>
        <b-col>
          <actions :value="entry.actions" @input="update_action(entry.id, $event)"></actions>
        </b-col>
      </b-row>
    </div>
  </div>

  <div class="row" style="margin-top: 25px">
    <div class="container">
      <b-row>
        <b-col cols=1>
          <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
        </b-col>
      </b-row>
      <b-row style="margin-top: 10px">
        <b-col>
          <conditions :value="conditions" @input="set_conditions($event)"></conditions>
        </b-col>
        <b-col>
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
    update_condition (index, value) {
      let id = this.entries.findIndex(Obj => Obj.id === index)
      this.entries[id].conditions = value
      this.$agent.p_mfa('ws_db_recipe_entry', 'update', [id, this.entries[id]])
    },
    update_action (index, value) {
      let id = this.entries.findIndex(Obj => Obj.id === index)
      this.entries[id].actions = value
      this.$agent.p_mfa('ws_db_recipe_entry', 'update', [id, this.entries[id]])
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
