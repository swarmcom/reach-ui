<template>
<div class="toggle-bar-custom">
  <button type="button" class="btn btn-sm pointer" @click="showCollapse"
         :class="$parent.showCollapse ? 'collapsed' : null"
         aria-controls="collapse4"
         :aria-expanded="$parent.showCollapse ? 'true' : 'false'">
    <icon v-if="$parent.showCollapse" name="minus" scale="0.5"></icon>
    <icon v-if="!$parent.showCollapse" name="plus" scale="0.5"></icon>
  </button>
  <div class="title">{{$parent.$options.widgetName}}</div>
</div>
</template>

<script>
export default {
  name: 'toggle-bar',
  data () {
    return {
    }
  },
  methods: {
    showCollapse () {
      this.$parent.showCollapse = !(this.$parent.showCollapse)
      let key = this.$parent.$options.storageName+'Collapsed'

      this.$agent.vm.storage_data[key] = this.$parent.showCollapse
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    }
  }
}
</script>