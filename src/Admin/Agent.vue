<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Agent Name"
    />
    <form-text
      v-model="rec.login"
      label="Login"
    />
    <form-password
      v-model="rec.password"
      label="Password"
    />
    <agent-groups
      v-model="rec.group_id"
      label="Agent Group"
    />
    <release-groups
      v-model="rec.release_group_id"
      label="Release Group"
      :effective="eff.release_group_id"
    />
    <lines
      v-model="rec.line_id"
      label="Line Out"
      :effective="eff.line_id ? eff.line.name : ''"
    />
    <roles
      v-model="rec.role_id"
      label="Role"
      :effective="eff.role_id"
    />
    <acl
      v-model="rec.acl_group_id"
      label="Access list"
      :effective="eff.acl_group_id"
    />
    <form-text
      v-model="rec.uri"
      label="Primary Contact"
    />
    <uris
      v-model="rec.uris"
      label="Additional Contacts"
    />
    <form-text
      v-model="rec.caller_id_number"
      label="Agent Caller ID Number"
    />
    <form-number
      v-model="rec.ring_timeout"
      label="Ring Timeout"
      :effective="eff.ring_timeout"
    />
    <form-number
      v-model="rec.suspend_time"
      label="Suspend Time"
    />
    <form-number
      v-model="rec.max_ring_fails"
      label="Max Missed Calls (auto release)"
      :effective="eff.max_ring_fails"
    />
    <form-select-bool
      v-model="rec.reset_rings_fails"
      label="Reset Max Rings On Success"
      :effective="eff.reset_rings_fails"
    />
    <form-number
      v-model="rec.autologout"
      label="Auto Logout"
      :effective="eff.autologout"
    />
    <form-bool
      v-model="rec.persistent"
      label="Persistent"
    />
    <form-file
      v-model="rec.avatar"
      label="Avatar"
      uri="/avatar"
      :file-type="'image/*'"
    />
    <form-tags
      v-model="skills"
      label="Agent Skills"
      effective-label="Agent Inherited Skills"
      placeholder="Skill..."
      :effective="effective_skills"
    />

    <div style="margin-top:20px">
      <b-btn
        variant="primary"
        @click="onCommit"
      >
        Save
      </b-btn>
      <b-btn
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
import URIs from '@/Widget/URIs'
import FormPassword from '@/Widget/FormPassword'

export default {
  name: 'AdminAgent',
  components: {
    uris: URIs,
    'form-password': FormPassword
  },
  mixins: [Common],
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
      effective_skills: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_agent', 'get', [this.id])
        this.eff = await this.$agent.p_mfa('ws_db_agent', 'effective', [this.id])
        this.skills = this.skills2list(this.rec.skills)
        this.effective_skills = this.skills2list(this.eff.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_agent', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_agent', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  }
}
</script>
