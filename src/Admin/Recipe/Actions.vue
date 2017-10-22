<template>
<div>
  <div v-for="(action, index) of actions" class="form-row" style="margin-bottom: 5px">
    <b-col cols=1>
      <button @click="del(index)" class="btn btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </b-col>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="action.name"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown text="A" variant="primary" left>
            <b-dropdown-item v-for="comp of components" :key="comp.ref" @click="set_action(index, comp.ref)">{{comp.name}}</b-dropdown-item>
          </b-dropdown>
        </b-input-group-button>
      </b-input-group>
    </b-col>
    <b-col>
      <component v-bind:is="action.name" :args="action.args" @input="update_args(index, $event)"></component>
    </b-col>
  </div>

  <div class="form-row" v-if="edit" style="margin-bottom: 20px">
    <b-col cols=1>
      <button @click="add" class="btn btn-outline-seactionary"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </b-col>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="action"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown text="A" variant="primary" left>
            <b-dropdown-item v-for="comp of components" :key="comp.ref" @click="set(comp.ref)">{{comp.name}}</b-dropdown-item>
          </b-dropdown>
        </b-input-group-button>
      </b-input-group>
    </b-col>
    <b-col>
      <component :is="action" :args="args" @input="set_args"></component>
    </b-col>
  </div>
</div>
</template>

<script>
import Hangup from './Action/Hangup'
import Voicemail from './Action/Voicemail'
import Announce from './Action/Announce'
import Lua from './Action/Lua'
import Priority from './Action/Priority'
import Prioritize from './Action/Prioritize'
import Deprioritize from './Action/Deprioritize'
import TransferToQueue from './Action/TransferToQueue'
import TransferToOutgoing from './Action/TransferToOutgoing'

export default {
  name: 'admin-recipe-actions',
  props: ['value', 'edit'],
  components: {
    hangup: Hangup, announce: Announce, voicemail: Voicemail, priority: Priority, prioritize: Prioritize, deprioritize: Deprioritize,
    transfer_to_queue: TransferToQueue, transfer_to_outgoing: TransferToOutgoing, lua: Lua
  },
  data () {
    return {
      components: [
        { name: 'Hangup', ref: 'hangup' },
        { name: 'Announce', ref: 'announce' },
        { name: 'Lua script', ref: 'lua' },
        { name: 'Voicemail', ref: 'voicemail' },
        { name: 'Priority', ref: 'priority' },
        { name: 'Prioritize', ref: 'prioritize' },
        { name: 'Deprioritize', ref: 'deprioritize' },
        { name: 'Transfer to Queue', ref: 'transfer_to_queue' },
        { name: 'Transfer to Outgoing', ref: 'transfer_to_outgoing' },
      ],
      action: undefined,
      args: [],
      actions: this.value
    }
  },
  methods: {
    commit () {
      this.$emit('input', this.actions)
    },
    set (value) {
      this.action = value
    },
    set_args (value) {
      this.args = value
    },
    update_args (id, value) {
      this.actions[id].args = value
      this.commit()
    },
    set_action(id, value) {
      this.actions[id].name = value
      this.actions[id].args = []
      this.commit()
    },
    add () {
      this.actions.push({ name: this.action, args: this.args })
      this.action = undefined
      this.args = []
    },
    del (id) {
      this.actions.splice(id, 1)
    },
    show () {
      console.log(this)
    }
  },
  watch: {
    actions () {
      this.commit()
    },
  },
}
</script>
