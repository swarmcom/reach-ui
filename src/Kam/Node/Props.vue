<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Node properties:</h3>
    </div>
  </div>

  <div class="form">
    <form-text label="Name" v-model="rec.name"></form-text>
    <form-text label="Description" v-model="rec.description"></form-text>
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
      redirect: '/kam/nodes',
      result: ''
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
      this.result = await this.$agent.p_mfa('ws_admin', 'sofia_reload', [this.id])
    },
    sofia_rescan: async function () {
      this.result = await this.$agent.p_mfa('ws_admin', 'sofia_rescan', [this.id])
    },
    sofia_status: async function () {
      this.result = await this.$agent.p_mfa('ws_admin', 'sofia_status', [this.id])
    },
    node_status: async function () {
      this.result = await this.$agent.p_mfa('ws_admin', 'node_status', [this.id])
    }
  },
}
</script>
