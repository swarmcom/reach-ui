<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Line-In Name"
    />
    <form-text
      v-model="rec.description"
      label="Line-In Description"
    />
    <disposition-groups
      v-model="rec.disposition_group_id"
      label="Disposition Group"
      :effective="eff.disposition_group_id"
    />
    <luas
      v-model="rec.entry_lua_id"
      label="Entry Lua Script"
      :effective="eff.entry_lua_id"
    />
    <luas
      v-model="rec.exit_lua_id"
      label="Exit Lua Script"
      :effective="eff.exit_lua_id"
    />
    <luas
      v-model="rec.uri_lua_id"
      label="Agent Lua Script"
      :effective="eff.uri_lua_id"
    />
    <queues
      v-model="rec.queue_id"
      label="Queue"
    />
    <clients
      v-model="rec.client_id"
      label="Client"
    />
    <prompts
      v-model="rec.announce_id"
      label="Welcome Message"
      :effective="eff.announce_id"
    />
    <form-select-bool
      v-model="rec.allow_voicemail"
      label="Allow Voicemail"
    />
    <prompts
      v-model="rec.voicemail_prompt_id"
      label="Voicemail Prompt"
      :effective="eff.voicemail_prompt_id"
    />
    <form-call-recording
      v-model="rec.enable_call_recording"
      label="Call recording"
      :effective="eff.enable_call_recording"
    />
    <form-select-bool
      v-model="rec.answer_on_agent"
      label="Answer on Agent pickup"
    />
    <form-select-bool
      v-model="rec.override_clid"
      label="Override Caller ID"
      :effective="eff.override_clid"
    />
    <form-text
      v-model="rec.caller_id_name"
      label="Caller ID Name"
      :effective="eff.caller_id_name"
    />
    <form-number
      v-model="rec.caller_id_number"
      label="Caller ID Number"
      :effective="eff.caller_id_number"
    />
    <form-tags
      v-model="skills"
      placeholder="Skill..."
      label="Line-In Skills"
      effective_label="Line-In Inherited Skills"
      :effective="effective_skills"
    />
    <div style="margin-top: 20px">
      <b-btn
        class="btn btn-primary pointer"
        variant="primary"
        @click="onCommit"
      >
        Commit
      </b-btn>
      <b-btn
        class="pointer"
        variant="outline-primary"
        @click="onCancel"
      >
        Cancel
      </b-btn>
      <b-btn
        class="float-right pointer"
        variant="danger"
        @click="onDelete"
      >
        Delete
      </b-btn>
    </div>
    <help />
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import Obj from '@/Admin/Object'
import FormCallRecording from '@/Widget/FormCallRecording'

export default {
  name: 'AdminLineIn',
  components: { 'form-call-recording': FormCallRecording },
  mixins: [Common, Obj],
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      rec: {},
      eff: {},
      skills: [],
      effective_skills: [],
      module: 'ws_db_line_in'
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa(this.module, 'get', [this.id])
        this.eff = await this.$agent.p_mfa(this.module, 'inherited', [this.id])
        this.skills = this.skills2list(this.rec.skills)
        this.effective_skills = this.skills2list(this.eff.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa(this.module, 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa(this.module, 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
  }
}
</script>
