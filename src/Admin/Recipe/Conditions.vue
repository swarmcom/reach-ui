<template>
<div class="container">
  <b-form-row v-for="(cond, index) of conditions" :key="cond.name" style="margin-bottom: 5px">
    <b-col cols=1>
      <button @click="del(index)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
    </b-col>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="cond.name"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown text="C" variant="success" left>
            <b-dropdown-item v-for="comp of components" :key="comp.ref" @click="set_cond(index, comp.ref)">{{comp.name}}</b-dropdown-item>
          </b-dropdown>
        </b-input-group-button>
      </b-input-group>
    </b-col>
    <b-col>
      <component v-bind:is="cond.name" :args="cond.args" @input="update_args(index, $event)"></component>
    </b-col>
  </b-form-row>

  <div class="form-row" v-if="edit">
    <b-col cols=1>
      <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
    </b-col>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="condition"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown text="C" variant="success" left>
            <b-dropdown-item v-for="comp of components" :key="comp.ref" @click="set(comp.ref)">{{comp.name}}</b-dropdown-item>
          </b-dropdown>
        </b-input-group-button>
      </b-input-group>
    </b-col>
    <b-col>
      <component :is="condition" :args="args" @input="set_args"></component>
    </b-col>
  </div>
</div>
</template>

<script>
import Ticks from './Condition/Ticks'
import Periodic from './Condition/Periodic'
import AvailableAgents from './Condition/AvailableAgents'
import EligibleAgents from './Condition/EligibleAgents'

export default {
  name: 'admin-recipe-conditions',
  props: ['value', 'edit'],
  components: {
    ticks: Ticks,
    periodic: Periodic,
    available_agents: AvailableAgents,
    eligible_agents: EligibleAgents
  },
  data () {
    return {
      components: [
        { name: 'Ticks', ref: 'ticks' },
        { name: 'Periodic', ref: 'periodic' },
        { name: 'Agents available', ref: 'available_agents' },
        { name: 'Agents eligible', ref: 'eligible_agents' },
      ],
      condition: undefined,
      args: [],
      conditions: this.value
    }
  },
  methods: {
    commit () {
      this.$emit('input', this.conditions)
    },
    set (value) {
      this.condition = value
    },
    set_args (value) {
      this.args = value
    },
    update_args (id, value) {
      this.conditions[id].args = value
      this.commit()
    },
    set_cond(id, value) {
      console.log("SET", id)
      this.conditions[id].name = value
      this.conditions[id].args = []
      this.commit()
    },
    add () {
      this.conditions.push({ name: this.condition, args: this.args })
      this.condition = undefined
      this.args = []
    },
    del (id) {
      this.conditions.splice(id, 1)
    },
    show () {
      console.log(this)
    }
  },
  watch: {
    conditions () {
      this.commit()
    },
  },
}
</script>
