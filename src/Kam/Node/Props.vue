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
      redirect: '/kam/nodes'
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
    }
  },
}
</script>
