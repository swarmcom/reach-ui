<template>
<div style="margin-top: 20px">
  <h3>Agent:</h3>
  <div class="row">
    <div class="col-5">
      <dl class="row">
        <dt class="col-sm-4">Name:</dt>
        <dd class="col-sm-8">{{ agent.name }}</dd>
        <dt class="col-sm-4">Login:</dt>
        <dd class="col-sm-8">{{ agent.login }}</dd>
        <dt class="col-sm-4">Group:</dt>
        <dd class="col-sm-8">{{ agent.group.name || '&nbsp' }}</dd>
        <dt class="col-sm-4">Role:</dt>
        <dd class="col-sm-8">{{ agent.role.name || '&nbsp' }}</dd>
        <dt class="col-sm-4">SIP Contact:</dt>
        <dd class="col-sm-8">{{ agent.uri }}</dd>
      </dl>
    </div>
    <div class="col-5">
      <dl class="row">
        <dt class="col-sm-4">Line Out:</dt>
        <dd class="col-sm-8">{{ agent.line.name || '&nbsp' }}</dd>
        <dt class="col-sm-4">Caller Id:</dt>
        <dd class="col-sm-8">{{ agent.caller_id_number || '&nbsp' }}</dd>
        <dt class="col-sm-4">Ring timeout:</dt>
        <dd class="col-sm-8">{{ agent.ring_timeout || '&nbsp' }}</dd>
        <dt class="col-sm-4">Max rings:</dt>
        <dd class="col-sm-8">{{ agent.max_ring_fails || '&nbsp' }}</dd>
        <dt class="col-sm-4">Auto logout:</dt>
        <dd class="col-sm-8">{{ agent.autologout || '&nbsp' }}</dd>
      </dl>
    </div>
    <div class="col">
      <div class="row">Skills:</div>
      <div class="row" v-for="(v, k) in agent.skills">
        <dt class="col">{{ k }}:</dt>
        <dd class="col">{{ v }}</dd>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Skills from '../Widget/Skills.vue'

export default {
  name: 'agent-info',
  data () {
    return {
      agent: this.$agent.vm.agent
    }
  }
}
</script>
