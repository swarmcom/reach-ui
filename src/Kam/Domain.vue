<template>
  <div
    class="container"
    style="margin-top:20px"
  >
    <div class="row">
      <div class="col-4">
        <h3>Domain:</h3>
      </div>
    </div>

    <div class="form">
      <form-text
        id="name"
        v-model="rec.name"
        label="Domain Name"
      />
      <form-text
        id="description"
        v-model="rec.description"
        label="Domain Description"
      />
    </div>

    <div
      class="row"
      style="margin-top: 20px"
    >
      <div class="col">
        <button
          class="btn btn-primary"
          @click="onCommit"
        >
          Save
        </button>
        <button
          class="btn btn-outline-primary"
          @click="onCancel"
        >
          Cancel
        </button>
        <button
          class="btn btn-danger float-right"
          @click="onDelete"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

export default {
  name: 'AdminKamDomain',
  mixins: [Common, Obj],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      rec: {},
      module: 'ws_kam_domain'
    }
  },
}
</script>
