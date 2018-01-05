<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Skill group:</h3>
    </div>
  </div>

  <div class="form">
    <form-text id="name" label="Skill Group Name" v-model="rec.name"></form-text>
    <form-text id="description" label="Skill Group Description" v-model="rec.description"></form-text>
    <div class="row" style="margin-top: 5px">
      <label class="col-3 col-form-label">Group Skills</label>
      <div class="col-9">
        <tags v-model="tags"></tags>
      </div>
    </div>

    <div style="margin-top:20px">
      <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
      <button @click="onCancel" class="btn btn-outline-primary pointer">Cancel</button>
      <button @click="onDelete" class="btn btn-danger float-right pointer">Delete</button>
    </div>
  </div>

  <help></help>
</div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

export default {
  name: 'admin-tag-group',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      tags: [],
      rec: {},
      module: 'ws_db_tag_group',
      redirect: '/admin/tag_groups'
    }
  },
  watch: {
    tags (value) {
      this.rec.tags = value
      return value
    },
    rec (value) {
      if (Array.isArray(value.tags)) {
        this.tags = value.tags
      }
      return value
    }
  }
}
</script>
