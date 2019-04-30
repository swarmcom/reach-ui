<template>
  <b-form-row>
    <b-col>
      <select
        class="custom-select"
        :value="line_id"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="line_out in line_outs"
          :key="line_out.id"
          :value="line_out.id"
          :selected="isActive(line_out.id)"
        >
          {{ line_out.name }}
        </option>
      </select>
    </b-col>
    <b-col v-if="line_id">
      <b-form-input v-model="number" />
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'AdminRecipeActionTransferToOutgoing',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      line_id: this.args[0],
      number: this.args[1],
      line_outs: []
    }
  },
  watch: {
    line_id () {
      this.commit()
    },
    number () {
      this.commit()
    }
  },
  created () {
    this.query()
  },
  methods: {
    commit () {
      this.$emit('input', [this.line_id, this.number])
    },
    isActive(Id) {
      return Id == this.line_id
    },
    query: async function () {
      this.line_outs = await this.$agent.p_mfa('ws_db_line_out', 'get')
    },
    onUpdate (line_id) {
      this.line_id = line_id
      this.commit()
    }
  }
}
</script>
