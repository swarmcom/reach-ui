<template>
<div>
<ul style="margin-top: 10px" class="nav nav-tabs">
  <li class="nav-item">
    <router-link class="nav-link" to="/live/agent">Agent</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/live/agents">Agents</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/live/inbounds">Inbounds</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/live/outbounds">Outbounds</router-link>
  </li>
</ul>
<transition name="reach" mode="out-in">
  <router-view style="margin-top: 20px"></router-view>
</transition>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  },
  components: {
  }
}
</script>
