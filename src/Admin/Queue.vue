<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Queue Name"
    />
    <queue-groups
      v-model="rec.group_id"
      label="Queue Group"
    />
    <recipes
      v-model="rec.recipe_id"
      label="Recipe"
    />
    <mohs
      v-model="rec.moh_id"
      label="Music on hold"
      :effective="eff.moh_id"
    />
    <form-number
      v-model="rec.weight"
      label="Weight"
      :effective="eff.weight"
    />
    <form-number-real
      v-model="rec.aging_factor"
      label="Aging"
      :effective="eff.aging_factor"
    />
    <form-select-bool
      v-model="rec.wrapup_enabled"
      label="Wrap-up enabled"
      :effective="eff.wrapup_enabled"
    />
    <form-number
      v-model="rec.wrapup_timer"
      label="Wrap-up timer"
      :effective="eff.wrapup_timer"
    />
    <form-number
      v-model="rec.auto_wrapup"
      label="Auto Wrap-up"
      :effective="eff.auto_wrapup"
    />
    <form-tags
      v-model="skills"
      label="Queue Skills"
      placeholder="Skill..."
      effective-label="Queue Inherited Skills"
      :effective="effective_skills"
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
  name: 'AdminQueue',
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
      skills: [],
      effective_skills: [],
      eff: {},
      recipe: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_queue', 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
        this.eff = await this.$agent.p_mfa('ws_db_queue', 'inherited', [this.id])
        this.effective_skills = this.skills2list(this.eff.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_queue', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_queue', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_queue', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  }
}
</script>
