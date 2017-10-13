<template>
<div class="form">
  <form-text label="Name" v-model="line_out.name"></form-text>
  <form-text label="Number" v-model="line_out.number"></form-text>
  <form-text label="Description" v-model="line_out.description"></form-text>
  <clients label="Client" v-model="line_out.client_id"></clients>
  <form-select-bool label="Override Caller ID" v-model="line_out.override_clid"></form-select-bool>
  <form-text label="Caller ID name" v-model="line_out.caller_id_name"></form-text>
  <form-text label="Caller ID number" v-model="line_out.caller_id_number"></form-text> 
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'
import FormSelectBool from '../Widget/FormSelectBool.vue'
import FormText from '../Widget/FormText.vue'
import Clients from '../Widget/Clients.vue'

export default {
  name: 'admin-line-out',
  props: ['id'],
  components: { 'form-text': FormText, 'clients': Clients, 'form-select-bool': FormSelectBool },
  mixins: [Common],
  data () {
    return {
      line_out: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.line_out = await this.$agent.p_mfa('ws_admin', 'get_line_out', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_line_out', [this.id, this.line_out])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_line_out', [this.line_out])
        }
        this.$router.push('/admin/line_outs')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_line_out', [this.id])
        this.$router.push('/admin/line_outs')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
