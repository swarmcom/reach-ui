<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Client Name"
    />
    <disposition-groups
      v-model="rec.disposition_group_id"
      label="Disposition Group"
    />
    <luas
      v-model="rec.entry_lua_id"
      label="Entry Lua Script"
    />
    <luas
      v-model="rec.exit_lua_id"
      label="Exit Lua Script"
    />
    <luas
      v-model="rec.uri_lua_id"
      label="Agent Lua Script"
    />
    <mohs
      v-model="rec.moh_id"
      label="Music on hold"
    />
    <prompts
      v-model="rec.announce_id"
      label="Announce"
    />
    <form-select-bool
      v-model="rec.allow_voicemail"
      label="Allow Voicemail"
    />
    <prompts
      v-model="rec.voicemail_prompt_id"
      label="Voicemail prompt"
    />
    <form-call-recording
      v-model="rec.enable_call_recording"
      label="Call recording"
    />
    <form-select-bool
      v-model="rec.override_clid_line_in"
      label="Override Caller ID on Line In"
    />
    <form-select-bool
      v-model="rec.override_clid_line_out"
      label="Override Caller ID on Line Out"
    />
    <form-text
      v-model="rec.caller_id_name"
      label="Caller ID Name"
    />
    <form-number
      v-model="rec.caller_id_number"
      label="Caller ID Number"
    />
    <form-file
      v-model="rec.avatar"
      label="Client Avatar"
      uri="/avatar"
      :file-type="'image/*'"
    />
    <form-tags
      v-model="skills"
      label="Client Skills"
      placeholder="Skill..."
    />
    <div style="margin-top: 20px">
      <b-btn
        variant="primary"
        @click="onCommit"
      >
        Save
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
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'
import FormCallRecording from '@/Widget/FormCallRecording'

export default {
  name: 'AdminClient',
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
      skills: [],
      module: 'ws_db_client'
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa(this.module, 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
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
