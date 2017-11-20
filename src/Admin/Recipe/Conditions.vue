<template>
<div class="container">
  <b-form-row v-for="(cond, index) of conditions" :key="cond.name" style="margin-bottom: 5px">
    <b-col cols=1>
      <button @click="del(index)" class="btn btn-outline-danger pointer"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </b-col>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="cond.name"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown text="C" variant="success" left>
            <b-dropdown-item v-for="comp of parts" :key="comp.ref" @click="set_cond(index, comp.ref)">{{comp.name}}</b-dropdown-item>
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
      <button @click="add" class="btn btn-outline-secondary pointer"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </b-col>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="condition"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown variant="success" left>
            <b-dropdown-item v-for="comp of parts" :key="comp.ref" @click="set(comp.ref)">{{comp.name}}</b-dropdown-item>
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
import ReleasedAgents from './Condition/ReleasedAgents'
import ActiveAgents from './Condition/ActiveAgents'
import AvailableAgentsRatio from './Condition/AvailableAgentsRatio'
import EligibleAgentsRatio from './Condition/EligibleAgentsRatio'
import ReleasedAgentsRatio from './Condition/ReleasedAgentsRatio'
import ActiveAgentsRatio from './Condition/ActiveAgentsRatio'
import CallsInQueue from './Condition/CallsInQueue'
import PositionInQueue from './Condition/PositionInQueue'
import Client from './Condition/Client'
import Hour from './Condition/Hour'
import DayOfWeek from './Condition/DayOfWeek'
import MediaType from './Condition/MediaType'
import ClientCallsQueued from './Condition/ClientCallsQueued'
import CallerId from './Condition/CallerId'
import CallerName from './Condition/CallerName'
export default {
  name: 'admin-recipe-conditions',
  props: ['value', 'edit'],
  components: {
    ticks: Ticks,
    periodic: Periodic,
    available_agents: AvailableAgents,
    eligible_agents: EligibleAgents,
    released_agents: ReleasedAgents,
    active_agents: ActiveAgents,
    available_agents_ratio: AvailableAgentsRatio,
    eligible_agents_ratio: EligibleAgentsRatio,
    released_agents_ratio: ReleasedAgentsRatio,
    active_agents_ratio: ActiveAgentsRatio,
    calls_queued: CallsInQueue,
    queue_position: PositionInQueue,
    client: Client,
    hour: Hour,
    weekday: DayOfWeek,
    type: MediaType,
    client_calls_queued: ClientCallsQueued,
    caller_id: CallerId,
    caller_name: CallerName,
  },
  data () {
    return {
      parts: [
        { name: 'Tick Interval', ref: 'ticks' },
        { name: 'Periodic', ref: 'periodic' },
        { name: 'Agents Available', ref: 'available_agents' },
        { name: 'Agents Eligible', ref: 'eligible_agents' },
        { name: 'Agents Released', ref: 'released_agents' },
        { name: 'Agents Active', ref: 'active_agents' },
        { name: 'Agents Available Ratio', ref: 'available_agents_ratio' },
        { name: 'Agents Eligible Ratio', ref: 'eligible_agents_ratio' },
        { name: 'Agents Released Ratio', ref: 'released_agents_ratio' },
        { name: 'Agents Active Ratio', ref: 'active_agents_ratio' },
        { name: 'Calls in Queue', ref: 'calls_queued' },
        { name: 'Position in Queue', ref: 'queue_position' },
        { name: 'Client', ref: 'client' },
        { name: 'Hour', ref: 'hour' },
        { name: 'Day of Week', ref: 'weekday' },
        { name: 'Media Type', ref: 'type' },
        { name: 'Clients Calls Queued', ref: 'client_calls_queued' },
        { name: 'Caller ID', ref: 'caller_id' },
        { name: 'Caller Name', ref: 'caller_name' },
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
