<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><b-col><h3>Permissions:</h3></b-col></b-row>
  <b-row>
    <b-col>
      <b-row> <b-col><h4>Available Tabs:</h4></b-col></b-row>
      <b-row v-for="p of this.ui" :key="p">
          <b-col cols="10">{{names[p].name}}</b-col>
          <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>
    <b-col>
      <b-row> <b-col><h4>Available Widgets:</h4></b-col></b-row>
      <b-row v-for="p of this.widgets" :key="p">
          <b-col cols="10">{{names[p].name}}</b-col>
          <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>
  </b-row>

  <b-row style="margin-top: 20px">
    <b-col>
      <b-row><b-col><h4>UI Features:</h4></b-col></b-row>
      <b-row v-for="p of this.features" :key="p">
          <b-col cols="10">{{names[p].name}}</b-col>
          <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>
    <b-col>
      <b-row><b-col><h4>Call Features:</h4></b-col></b-row>
      <b-row v-for="p of this.call_features" :key="p">
          <b-col cols="10">{{names[p].name}}</b-col>
          <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>
  </b-row>

</div>
</template>

<script>
export default {
  name: 'admin-role-permissions',
  props: ['id'],
  data () {
    return {
      name: undefined,
      effective: {},
      ui: ['admin-ui', 'profile-ui', 'recordings-ui', 'reports-ui', 'monitor-ui'],
      widgets: ['myStatistics-widget', 'queueManager-widget', 'agentManager-widget' ],
      features: [
        'myPhone-feature', 'outbound-feature', 'CROnDemand-feature', 'transAgent-feature', 'transQueue-feature',
        'transNumber-feature', 'confAgent-feature', 'confQueue-feature', 'confNumber-feature', 'transConfChangeSkills-feature'
      ],
      call_features: ['sip-can-register'],
      names: {
        "admin-ui": { name: "Admin" },
        "profile-ui": { name: "Profile" },
        "recordings-ui": { name: "Recordings" },
        "reports-ui": { name: "Reports" },
        "monitor-ui": { name: "Monitor" },
        "agentManager-widget": { name: "Agent Manger" },
        "queueManager-widget": { name: "Queue Manager" },
        "myStatistics-widget": { name: "My Statistics" },
        "myPhone-feature": { name: "Set My Phone" },
        "outbound-feature": { name: "Allow Outbound" },
        "CROnDemand-feature": { name: "Allow On Demand Call Recording" },
        "transAgent-feature": { name: "Transfer to Agent" },
        "transQueue-feature": { name: "Transfer to Queue" },
        "transNumber-feature": { name: "Transfer to Number" },
        "confAgent-feature": { name: "Conference to Agent" },
        "confQueue-feature": { name: "Conference to Queue" },
        "confNumber-feature": { name: "Conference to Number" },
        "transConfChangeSkills-feature": { name: "Change Skills on Conf/Tran" },
        "sip-can-register": { name: "Allow to register SIP phone" }
      }
    }
  },
  methods: {
    query: async function () {
      this.effective = await this.$agent.p_mfa('ws_db_permission', 'map', [this.id])
    },
    onChange: async function(perm, checked) {
      if (checked) {
        await this.$agent.p_mfa('ws_db_permission', 'set', [this.id, perm])
        this.effective[perm] = true
      }
      else {
        await this.$agent.p_mfa('ws_db_permission', 'unset', [this.id, perm])
        delete this.effective[perm]
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
