<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Line-Out Name"
    />
    <form-text
      v-model="rec.description"
      label="Line-Out Description"
    />
    <clients
      v-model="rec.client_id"
      label="Client"
    />
    <form-call-recording
      v-model="rec.enable_call_recording"
      label="Call recording"
    />
    <form-select-bool
      v-model="rec.override_clid"
      label="Override Caller ID (outbound)"
    />
    <form-text
      v-model="rec.caller_id_name"
      label="Caller ID name"
    />
    <form-number
      v-model="rec.caller_id_number"
      label="Caller ID number"
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
  name: 'AdminLineOut',
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
      module: 'ws_db_line_out'
    }
  }
}
</script>
