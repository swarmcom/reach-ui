<template>
<div>
  <div v-for="(action, index) of actions" class="form-row">
    <div class="form-group col-2">
      <button @click="del(index)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
    </div>
    <b-col cols=5>
      <b-input-group>
        <b-form-input v-model="action.name"></b-form-input>
        <b-input-group-button slot="left">
          <b-dropdown text="A" variant="primary" left>
            <b-dropdown-item v-for="comp of components" :key="comp.ref" @click="set(comp.ref)">{{comp.name}}</b-dropdown-item>
          </b-dropdown>
        </b-input-group-button>
      </b-input-group>
    </b-col>
    <b-col>
      <component v-bind:is="action.name" :args="action.args" @input="update_args(index, $event)"></component>
    </b-col>
  </div>

  <div class="form-row" v-if="edit" style="margin-bottom: 20px">
    <b-col cols=2>
      <button @click="add" class="btn btn-outline-seactionary"><icon name="plus" scale="1"></icon></button>
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

export default {
  name: 'admin-recipe-actions',
  props: ['value', 'edit'],
  components: {
    hangup: Hangup,
  },
  data () {
    return {
      components: [
        { name: 'Hangup', ref: 'hangup' },
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
