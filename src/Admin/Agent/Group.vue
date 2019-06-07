<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Agent Group Name"
    />
    <release-groups
      v-model="rec.release_group_id"
      label="Release Group"
    />
    <lines
      v-model="rec.line_id"
      label="Line Out"
    />
    <roles
      v-model="rec.role_id"
      label="Role"
    />
    <acl
      v-model="rec.acl_group_id"
      label="Access list"
    />
    <form-number
      v-model="rec.ring_timeout"
      label="Ring Timeout"
    />
    <form-number
      v-model="rec.suspend_time"
      label="Suspend Time"
    />
    <form-number
      v-model="rec.autologout"
      label="Auto Logout"
    />
    <form-number
      v-model="rec.max_ring_fails"
      label="Max Missed Calls (auto release)"
    />
    <form-select-bool
      v-model="rec.reset_rings_fails"
      label="Reset Max Rings On Success"
    />
    <form-tags
      v-model="skills"
      placeholder="Skill..."
      label="Skills"
    />

    <div style="margin-top:20px">
      <b-btn
        class="pointer"
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
import Common from '@/Admin/Common'

export default {
  name: 'AdminAgentGroup',
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
      module: 'ws_db_agent_group',
      skills: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_agent_group', 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent_group', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_agent_group', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_agent_group', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  }
}
</script>
