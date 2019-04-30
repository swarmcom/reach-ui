<template>
  <div>
    <div
      v-for="(itemAction, index) of actions"
      :key="index"
      class="form-row"
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
              text="A"
              variant="primary"
            >
              <b-dropdown-item
                v-for="comp of parts"
                :key="comp.ref"
                @click="set_action(index, comp.ref)"
              >
                {{ comp.name }}
              </b-dropdown-item>
            </b-dropdown>
          </b-input-group-prepend>
          <b-form-input v-model="itemAction.name" />
        </b-input-group>
      </b-col>
      <b-col v-if="edit">
        <component
          :is="itemAction.name"
          :args="itemAction.args"
          @input="update_args(index, $event)"
        />
      </b-col>
    </div>

    <div
      v-if="edit"
      class="form-row"
      style="margin-bottom: 20px"
    >
      <b-col cols="1">
        <b-btn
          class="pointer"
          variant="outline-secondary"
          @click="add"
        >
          <icon
            class="align-middle"
            name="plus"
            scale="1"
          />
        </b-btn>
      </b-col>
      <b-col cols="5">
        <b-input-group>
          <b-input-group-prepend>
            <b-dropdown
              text="A"
              variant="primary"
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
          <b-form-input v-model="action" />
        </b-input-group>
      </b-col>
      <b-col>
        <component
          :is="action"
          :args="args"
          @input="set_args"
        />
      </b-col>
    </div>
  </div>
</template>

<script>
import Hangup from '@/Admin/Recipe/Action/Hangup'
import Voicemail from '@/Admin/Recipe/Action/Voicemail'
import Announce from '@/Admin/Recipe/Action/Announce'
import Lua from '@/Admin/Recipe/Action/Lua'
import Priority from '@/Admin/Recipe/Action/Priority'
import Prioritize from '@/Admin/Recipe/Action/Prioritize'
import Deprioritize from '@/Admin/Recipe/Action/Deprioritize'
import TransferToQueue from '@/Admin/Recipe/Action/TransferToQueue'
import TransferToOutgoing from '@/Admin/Recipe/Action/TransferToOutgoing'
import AddSkills from '@/Admin/Recipe/Action/AddSkills'
import RemoveSkills from '@/Admin/Recipe/Action/RemoveSkills'

export default {
  name: 'AdminRecipeActions',
  components: {
    hangup: Hangup, announce: Announce, voicemail: Voicemail, priority: Priority, prioritize: Prioritize, deprioritize: Deprioritize,
    transfer_to_queue: TransferToQueue, transfer_to_outgoing: TransferToOutgoing, lua_script: Lua, lua_job: Lua,
    add_skills: AddSkills, remove_skills: RemoveSkills
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
        { name: 'Hangup', ref: 'hangup' },
        { name: 'Announce', ref: 'announce' },
        { name: 'Lua script', ref: 'lua_script' },
        { name: 'Lua job', ref: 'lua_job' },
        { name: 'Send To Voicemail', ref: 'voicemail' },
        { name: 'Set Priority', ref: 'priority' },
        { name: 'Prioritize', ref: 'prioritize' },
        { name: 'Deprioritize', ref: 'deprioritize' },
        { name: 'Transfer to Queue', ref: 'transfer_to_queue' },
        { name: 'Transfer to Outgoing', ref: 'transfer_to_outgoing' },
        { name: 'Add Skills', ref: 'add_skills' },
        { name: 'Remove Skills', ref: 'remove_skills'}
      ],
      action: undefined,
      args: [],
      actions: this.value
    }
  },
  watch: {
    actions () {
      this.commit()
    },
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
}
</script>
