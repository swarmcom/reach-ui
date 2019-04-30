<template>
  <div style="margin-top:20px">
    <b-row>
      <b-col cols="4">
        <h3>Release group:</h3>
      </b-col>
    </b-row>
    <div class="form">
      <form-text
        id="name"
        v-model="rec.name"
        label="Release Group Name"
      />
      <form-text
        id="description"
        v-model="rec.description"
        label="Release Group Description"
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
    </div>
    <help />
  </div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

export default {
  name: 'AdminReleaseGroup',
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
      module: 'ws_db_release_group'
    }
  },
}
</script>
