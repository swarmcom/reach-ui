<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Node properties:</h3>
    </div>
  </div>

  <div class="form">
    <form-text label="Property Name" v-model="rec.name"></form-text>
    <form-text label="Property Description" v-model="rec.description"></form-text>
    <template v-if="isGateway(rec)">
      <form-text label="Address" v-model="rec.address"></form-text>
      <form-text label="IP" v-model="rec.ip"></form-text>
      <template v-if="rec.type=='media'">
        <div class="row" style="margin-top: 5px">
          <label class="col-3 col-form-label">Proxy instance</label>
          <div class="col-9">
            <nodes :value="rec.props.proxy" type="proxy" v-on:input="props('proxy', arguments[0])"></nodes>
          </div>
        </div>
      </template>
    </template>

    <div style="margin-top:20px">
      <button @click="onCommit" class="btn btn-primary">Commit</button>
      <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
      <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
    </div>
  </div>

  <b-row style="margin-top:20px" v-if="rec.type=='media'">
    <b-col>
      <button @click="sofia_reload" class="btn btn-danger">SIP Restart</button>
      <button @click="sofia_rescan" class="btn btn-primary">SIP Reload</button>
      <button @click="sofia_status" class="btn btn-secondary">Sofia Status</button>
      <button @click="node_status" class="btn btn-secondary">Node Status</button>
      <button @click="sofia_profile_status" class="btn btn-secondary">SIP Profile Status</button>
    </b-col>
  </b-row>

  <b-row style="margin-top:20px" v-if="rec.type=='proxy'">
    <b-col>
      <button @click="proxy_debug('debug')" class="btn btn-outline-secondary">Debug</button>
      <button @click="proxy_debug('info')" class="btn btn-outline-secondary">Info</button>
      <button @click="proxy_debug('notice')" class="btn btn-outline-secondary">Notice</button>
      <button @click="proxy_debug('warn')" class="btn btn-outline-secondary">Warn</button>
      <button @click="proxy_debug('err')" class="btn btn-outline-secondary">Err</button>
    </b-col>
  </b-row>

  <b-row style="margin-top:20px" v-if="rec.type=='proxy'">
    <b-col>
      <button @click="proxy_stats" class="btn btn-secondary">Stats</button>
      <button @click="proxy_cfgs" class="btn btn-secondary">Configs</button>
      <button @click="proxy_regs" class="btn btn-secondary">Regs</button>
      <button @click="proxy_dlgs" class="btn btn-secondary">Dialogs</button>
    </b-col>
  </b-row>

  <b-row style="margin-top:20px">
    <b-col>
      <pre>{{ result }}</pre>
    </b-col>
  </b-row>

</div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'
import Nodes from '@/Kam/Widget/Nodes'

export default {
  name: 'kam-node-properties',
  components: { Nodes },
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_kam_node',
      result: '',
      view: null
    }
  },
  methods: {
    isGateway({type}) {
      return (type === 'proxy' || type === 'media' || type === 'gateway')
    },
    props (k, v) {
      if (typeof this.rec.props != 'object') {
        this.rec.props = {}
      }
      this.rec.props[k] = v
    },
    sofia_reload: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'sofia_reload', [this.id])
    },
    sofia_rescan: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'sofia_rescan', [this.id])
    },
    sofia_status: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'sofia_status', [this.id])
    },
    sofia_profile_status: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'sofia_profile_status', [this.id])
    },
    node_status: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'node_status', [this.id])
    },
    proxy_stats: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'proxy_stats', [this.id])
    },
    proxy_cfgs: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'proxy_cfgs', [this.id])
    },
    proxy_debug: async function (level) {
      this.result = await this.$agent.p_mfa('ws_master', 'proxy_debug', [this.id, level])
    },
    proxy_regs: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'proxy_regs', [this.id])
    },
    proxy_dlgs: async function () {
      this.result = await this.$agent.p_mfa('ws_master', 'proxy_dlgs', [this.id])
    },
    onCancel () {
      this.$router.go(-1)
    },
  },
}
</script>
