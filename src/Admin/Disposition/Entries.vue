<template>
  <div>
    <b-row style="margin-bottom: 10px">
      <b-col>
        <h3>Dispositions:</h3>
      </b-col>
    </b-row>
    <div
      v-for="disposition of dispositions"
      :key="disposition.id"
      class="form-row"
      style="margin-top: 5px"
    >
      <b-col cols="1">
        <b-btn
          class="btn btn-outline-danger pointer"
          variant="outline-danger"
          @click="del(disposition.id)"
        >
          <icon
            class="align-middle"
            name="minus"
            scale="1"
          />
        </b-btn>
      </b-col>
      <b-col cols="4">
        <input
          type="text"
          class="form-control"
          :value="safe_value(disposition.name)"
          @change="onChange(disposition, 'name', $event.target.value)"
        >
      </b-col>
      <b-col cols="5">
        <input
          type="text"
          class="form-control"
          :value="safe_value(disposition.description)"
          @change="onChange(disposition, 'description', $event.target.value)"
        >
      </b-col>
    </div>
    <div
      class="form-row"
      style="margin-top: 5px"
    >
      <b-col cols="1">
        <b-btn
          class="pointer"
          variant="outline-secondary"
          @click="add"
        >
          <icon
            class="align-middle"
            name="plus"
            scale="1"
          />
        </b-btn>
      </b-col>
      <b-col cols="4">
        <input
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Name"
        >
      </b-col>
      <b-col cols="5">
        <input
          v-model="description"
          type="text"
          class="form-control"
          placeholder="Description"
        >
      </b-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDispositionEntries',
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      name: undefined,
      description: undefined,
      dispositions: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_db_disposition', 'get', [this.id])
    },
    onChange (disposition, field, value) {
      disposition[field] = value
      this.$agent.p_mfa('ws_db_disposition', 'update', [disposition.id, disposition])
    },
    add: async function() {
      let disposition = await this.$agent.p_mfa('ws_db_disposition', 'create', [this.id, {
        name: this.name, description: this.description
      }])
      this.dispositions.push(disposition)
      this.name = undefined
      this.description = undefined
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_disposition', 'delete', [Key])
      let id = this.dispositions.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.dispositions.splice(id, 1)
      }
    },
    safe_value (Value) {
      return Value === 'undefined' ? '' : Value
    }
  }
}
</script>
