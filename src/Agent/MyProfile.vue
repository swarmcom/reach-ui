<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentInfo" class="mt-2">
    <b-row>
      <b-col cols="4">
        <b-img src='src/assets/default_agent.png' style="width:100%" alt="avatar image" />
      </b-col>
      <b-col cols="8" class="agent-state-text">
        <b>{{agent.agent.name}}</b>
      </b-col>
    </b-row>
    <!--<b-row>
      <b-col class="agent-state-text">
        <div v-if="agent.state=='available'">
          <b-row>
            <b-col style="text-align: right">
            available
            </b-col>
            <b-col  style="text-align: left">
            <icon name="circle-o" ></icon>
            </b-col>
          </b-row>
        </div>
        <div v-if="agent.state=='release'">
          released
          <icon name="stop"></icon>
        </div>
        <div v-if="agent.state=='ringing'">
          ringing
          <icon name="wifi" scale="1" style="transform: rotate(270deg)"></icon>
        </div>
        <div v-if="agent.state=='outgoing'">
          outgoing
          <icon name="wifi" scale="1" style="transform: rotate(90deg)"></icon>
        </div>
        <div v-if="agent.state=='test'">
          test
          <icon name="phone" scale="1"></icon>
        </div>
        <div v-if="this.$agent.is_onsession()">
          on call
          <icon name="phone" scale="1"></icon>
        </div>
        <div v-if="this.$agent.is_hold()">
          on hold
          <icon name="pause" scale="1"></icon>
        </div>
        <div v-if="this.$agent.is_wrapup()">
          wrap up
          <icon name="pause" scale="1"></icon>
        </div>
      </b-col>
    </b-row>-->
  </b-collapse>
</div>
</template>

<script>
export default {
  widgetName: 'My Profile',
  storageName: 'myProfile',
  data () {
    return {
      agent: this.$agent.vm,
      showCollapse: true
    }
  },
  created () {
    if (this.$agent.vm.storage_data.myProfileCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.myProfileCollapsed
  }
}
</script>