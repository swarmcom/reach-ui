<template>
<div class="form">
  <form-text label="Line-Out Name" v-model="rec.name"></form-text>
  <form-text label="Line-Out Description" v-model="rec.description"></form-text>
  <clients label="Client" v-model="rec.client_id"></clients>
  <form-call-recording label="Call recording" v-model="rec.enable_call_recording"></form-call-recording>
  <form-select-bool label="Override Caller ID (outbound)" v-model="rec.override_clid"></form-select-bool>
  <form-text label="Caller ID name" v-model="rec.caller_id_name"></form-text>
  <form-text label="Caller ID number" v-model="rec.caller_id_number"></form-text>
  <div style="margin-top: 20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary pointer">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right pointer">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import Obj from '@/Admin/Object'
import FormCallRecording from '@/Widget/FormCallRecording'

export default {
  name: 'admin-line-out',
  props: ['id'],
  mixins: [Common, Obj],
  components: { 'form-call-recording': FormCallRecording },
  data () {
    return {
      rec: {},
      module: 'ws_db_line_out',
      redirect: '/line_outs'
    }
  }
}
</script>
