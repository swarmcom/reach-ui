<template>
  <div class="container">
    <b-form-row
      v-for="(cond, index) of conditions"
      :key="cond.name"
      style="margin-bottom: 5px"
    >
      <b-col
        v-if="edit"
        cols="1"
      >
        <b-btn
          class="pointer"
          variant="outline-danger"
          @click="del(index)"
        >
          <icon
            class="align-middle"
            name="minus"
            scale="1"
          />
        </b-btn>
      </b-col>
      <b-col
        v-if="edit"
        cols="5"
      >
        <b-input-group>
          <b-input-group-prepend>
            <b-dropdown
              text="C"
              variant="success"
            >
              <b-dropdown-item
                v-for="comp of parts"
                :key="comp.ref"
                @click="set_cond(index, comp.ref)"
              >
                {{ comp.name }}
              </b-dropdown-item>
            </b-dropdown>
          </b-input-group-prepend>
          <b-form-input v-model="cond.name" />
        </b-input-group>
      </b-col>
      <b-col v-if="edit">
        <component
          :is="cond.name"
          :args="cond.args"
          @input="update_args(index, $event)"
        />
      </b-col>
    </b-form-row>

    <div
      v-if="edit"
      class="form-row"
    >
      <b-col cols="1">
        <button
          class="btn btn-outline-secondary pointer"
          @click="add"
        >
          <icon
            class="align-middle"
            name="plus"
            scale="1"
          />
        </button>
      </b-col>
      <b-col cols="5">
        <b-input-group>
          <b-input-group-prepend>
            <b-dropdown
              text="C"
              variant="success"
            >
              <b-dropdown-item
                v-for="comp of parts"
                :key="comp.ref"
                @click="set(comp.ref)"
              >
                {{ comp.name }}
              </b-dropdown-item>
            </b-dropdown>
          </b-input-group-prepend>
          <b-form-input v-model="condition" />
        </b-input-group>
      </b-col>
      <b-col>
        <component
          :is="condition"
          :args="args"
          @input="set_args"
        />
      </b-col>
    </div>
  </div>
</template>

<script>
import Ticks from '@/Admin/Recipe/Condition/Ticks'
import Periodic from '@/Admin/Recipe/Condition/Periodic'
import AvailableAgents from '@/Admin/Recipe/Condition/AvailableAgents'
import EligibleAgents from '@/Admin/Recipe/Condition/EligibleAgents'
import ReleasedAgents from '@/Admin/Recipe/Condition/ReleasedAgents'
import ActiveAgents from '@/Admin/Recipe/Condition/ActiveAgents'
import AvailableAgentsRatio from '@/Admin/Recipe/Condition/AvailableAgentsRatio'
import EligibleAgentsRatio from '@/Admin/Recipe/Condition/EligibleAgentsRatio'
import ReleasedAgentsRatio from '@/Admin/Recipe/Condition/ReleasedAgentsRatio'
import ActiveAgentsRatio from '@/Admin/Recipe/Condition/ActiveAgentsRatio'
import CallsInQueue from '@/Admin/Recipe/Condition/CallsInQueue'
import PositionInQueue from '@/Admin/Recipe/Condition/PositionInQueue'
import Client from '@/Admin/Recipe/Condition/Client'
import Hour from '@/Admin/Recipe/Condition/Hour'
import DayOfWeek from '@/Admin/Recipe/Condition/DayOfWeek'
import MediaType from '@/Admin/Recipe/Condition/MediaType'
import ClientCallsQueued from '@/Admin/Recipe/Condition/ClientCallsQueued'
import CallerId from '@/Admin/Recipe/Condition/CallerId'
import CallerName from '@/Admin/Recipe/Condition/CallerName'
import CallSkills from '@/Admin/Recipe/Condition/CallSkills'
export default {
  name: 'AdminRecipeConditions',
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
    call_skills: CallSkills,
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    edit: {
      type: Boolean,
      default: false
    }
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
        { name: 'Call Skills', ref: 'call_skills'},
      ],
      condition: undefined,
      args: [],
      conditions: this.value
    }
  },
  watch: {
    conditions () {
      this.commit()
    },
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
}
</script>
