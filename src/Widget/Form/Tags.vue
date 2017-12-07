<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <template v-if="effective">
    <tags v-model="value" :placeholder="placeholder" class="col-5"></tags>
    <tags v-model="effective" disabled=true class="col-4"></tags>
  </template>
  <tags v-else v-model="value" :placeholder="placeholder" class="col-9"></tags>
</div>
</template>

<script>
export default {
  name: 'form-tags',
  props: ['label', 'value', 'effective', 'placeholder'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
