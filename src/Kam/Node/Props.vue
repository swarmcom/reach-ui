<template>
  <div
    class="container"
    style="margin-top:20px"
  >
    <div class="row">
      <div class="col-4">
        <h3>Node properties:</h3>
      </div>
    </div>

    <div class="form">
      <form-text
        v-model="rec.name"
        label="Property Name"
      />
      <form-text
        v-model="rec.description"
        label="Property Description"
      />
      <template v-if="isGateway(rec)">
        <form-text
          v-model="rec.address"
          label="Address"
        />
        <form-text
          v-model="rec.ip"
          label="IP"
        />
        <template v-if="rec.type=='media'">
          <div
            class="row"
            style="margin-top: 5px"
          >
            <label class="col-3 col-form-label">Proxy instance</label>
            <div class="col-9">
              <nodes
                :value="rec.props.proxy"
                type="proxy"
                @input="props('proxy', arguments[0])"
              />
            </div>
          </div>
        </template>
      </template>
      <form-bool
        v-if="rec.type=='proxy'"
        v-model="rec.props.fix_inbound_nated_sdp"
        label="NAT correction for inbound SDP"
      />

      <div style="margin-top:20px">
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

    <b-row
      v-if="rec.type=='media'"
      style="margin-top:20px"
    >
      <b-col>
        <button
          class="btn btn-danger"
          @click="sofia_reload"
        >
          SIP Restart
        </button>
        <button
          class="btn btn-primary"
          @click="sofia_rescan"
        >
          SIP Reload
        </button>
        <button
          class="btn btn-secondary"
          @click="sofia_status"
        >
          Sofia Status
        </button>
        <button
          class="btn btn-secondary"
          @click="node_status"
        >
          Node Status
        </button>
        <button
          class="btn btn-secondary"
          @click="sofia_profile_status"
        >
          SIP Profile Status
        </button>
      </b-col>
    </b-row>

    <b-row
      v-if="rec.type=='proxy'"
      style="margin-top:20px"
    >
      <b-col>
        <button
          class="btn btn-outline-secondary"
          @click="proxy_debug('debug')"
        >
          Debug
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="proxy_debug('info')"
        >
          Info
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="proxy_debug('notice')"
        >
          Notice
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="proxy_debug('warn')"
        >
          Warn
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="proxy_debug('err')"
        >
          Err
        </button>
      </b-col>
    </b-row>

    <b-row
      v-if="rec.type=='proxy'"
      style="margin-top:20px"
    >
      <b-col>
        <button
          class="btn btn-secondary"
          @click="proxy_stats"
        >
          Stats
        </button>
        <button
          class="btn btn-secondary"
          @click="proxy_cfgs"
        >
          Configs
        </button>
        <button
          class="btn btn-secondary"
          @click="proxy_regs"
        >
          Regs
        </button>
        <button
          class="btn btn-secondary"
          @click="proxy_dlgs"
        >
          Dialogs
        </button>
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
import FormBool from '@/Widget/FormBool'

export default {
  name: 'KamNodeProperties',
  components: { Nodes, 'form-bool': FormBool },
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
    }
  }
}
</script>
