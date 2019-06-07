<template>
  <div
    class="container"
    style="margin-top:20px"
  >
    <b-row>
      <b-col cols="4">
        <h3>Access list:</h3>
      </b-col>
    </b-row>
    <div class="form">
      <form-text
        id="name"
        v-model="rec.name"
        label="Access List Name"
      />
      <form-text
        id="description"
        v-model="rec.description"
        label="Access List Description"
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
          class="float-right"
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
  name: 'AdminAclGroup',
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
      module: 'ws_db_acl_group'
    }
  },
}
</script>
