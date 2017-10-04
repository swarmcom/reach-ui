<template>
<div class="toggle-bar-custom">
  <button type="button" class="btn btn-sm" @click="$parent.showCollapse = !$parent.showCollapse"
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
  name: 'toggleBar',
  data () {
    return {
    }
  },
}
</script>