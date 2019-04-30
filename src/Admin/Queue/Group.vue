<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Queue Group Name"
    />
    <recipes
      v-model="rec.recipe_id"
      label="Recipe"
    />
    <mohs
      v-model="rec.moh_id"
      label="Music on hold"
    />
    <form-number-real
      v-model="rec.aging_factor"
      label="Aging"
    />
    <form-number
      v-model="rec.weight"
      label="Weight"
    />
    <form-select-bool
      v-model="rec.wrapup_enabled"
      label="Wrap-up enabled"
    />
    <form-number
      v-model="rec.wrapup_timer"
      label="Wrap-up timer"
    />
    <form-number
      v-model="rec.auto_wrapup"
      label="Auto wrap-up"
    />
    <form-tags
      v-model="skills"
      label="Skills"
      placeholder="Skill..."
    />
    <div style="margin-top:20px">
      <b-btn
        class="pointer"
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

export default {
  name: 'AdminQueueGroup',
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
      module: 'ws_db_queue_group',
      skills: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_queue_group', 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue_group', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_queue_group', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue_group', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  }
}
</script>
