<template>
<div>
  <b-row style="margin-top: 5px">
    <b-col>
      <label :id="label" class="col-form-label">{{ label }}</label>
    </b-col>
    <tags v-model="value" :placeholder="placeholder" class="col-9"></tags>
  </b-row>
  <b-row v-if="has_effective()" style="margin-top: 5px">
    <b-col>
      <label :id="label" class="col-form-label">{{ effective_label }}</label>
    </b-col>
    <tags v-model="effective" disabled=true class="col-9"></tags>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'form-tags',
  props: ['label', 'effective_label', 'value', 'effective', 'placeholder'],
  data () {
    return {
    }
  },
  methods: {
    has_effective () {
      return this.effective && this.effective.length > 0
    }
  }
}
</script>
