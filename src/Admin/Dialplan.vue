<template>
  <div>
    <b-row style="margin-bottom: 10px">
      <b-col><h3>Inbound routing:</h3></b-col>
    </b-row>

    <b-form-row
      v-for="dial of entries"
      :key="dial.id"
      style="margin-top: 5px"
    >
      <b-col cols="2">
        <b-btn
          class="pointer"
          variant="outline-danger"
          size="sm"
          @click="del(dial.id)"
        >
          <icon
            class="align-middle"
            name="minus"
            scale="1"
          />
        </b-btn>
        <b-btn
          class="pointer"
          variant="outline-success"
          size="sm"
          @click="up(dial.id)"
        >
          <icon
            class="align-middle"
            name="arrow-up"
            scale="1"
          />
        </b-btn>
        <b-btn
          class="pointer"
          variant="outline-primary"
          size="sm"
          @click="down(dial.id)"
        >
          <icon
            class="align-middle"
            name="arrow-down"
            scale="1"
          />
        </b-btn>
      </b-col>

      <b-col cols="3">
        <select
          v-model="dial.header"
          class="custom-select pointer"
          @change="onChange(dial)"
        >
          <option />
          <option
            v-for="itemHeader in headers"
            :key="itemHeader"
            :value="itemHeader"
            :selected="itemHeader == dial.header"
          >
            {{ itemHeader }}
          </option>
        </select>
      </b-col>
      <b-col cols="5">
        <input
          v-model="dial.match"
          type="text"
          class="form-control"
          placeholder="Regex"
          @change="onChange(dial)"
        >
      </b-col>
      <b-col>
        <lines
          v-model="dial.line_in_id"
          @input="onChange(dial)"
        />
      </b-col>
    </b-form-row>

    <b-form-row style="margin-top: 5px">
      <b-col cols="2">
        <b-btn
          class="pointer"
          variant="outline-secondary"
          size="sm"
          @click="add"
        >
          <icon
            name="plus"
            scale="1"
            class="align-middle"
          />
        </b-btn>
      </b-col>
      <b-col cols="3">
        <select
          v-model="header"
          class="custom-select pointer"
        >
          <option />
          <option
            v-for="itemHeader in headers"
            :key="itemHeader"
            :value="itemHeader"
          >
            {{ itemHeader }}
          </option>
        </select>
      </b-col>
      <b-col cols="5">
        <input
          v-model="match"
          type="text"
          class="form-control"
          placeholder="Regex"
        >
      </b-col>
      <b-col>
        <lines v-model="line_id" />
      </b-col>
    </b-form-row>
  </div>
</template>

<script>
import LineIns from '@/Widget/LineIns'

export default {
  name: 'AdminDialplan',
  components: {
    lines: LineIns
  },
  data () {
    return {
      headers: [
        'Caller-Destination-Number',
        'Caller-Caller-ID-Number',
        'Caller-ANI',
        'Caller-Username',
      ],
      match: undefined,
      line_id: undefined,
      header: undefined,
      entries: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.entries = await this.$agent.p_mfa('ws_db_dial', 'get')
    },
    onChange (dial) {
      this.$agent.p_mfa('ws_db_dial', 'update', [dial.id, dial])
    },
    up: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_db_dial', 'up', [id])
    },
    down: async function (id) {
      this.entries = await this.$agent.p_mfa('ws_db_dial', 'down', [id])
    },
    add: async function() {
      let dial = await this.$agent.p_mfa('ws_db_dial', 'create', [{ match: this.match, line_in_id: this.line_id, header: this.header }])
      this.entries.push(dial)
      this.match = ''
      this.line_id = ''
      this.header = ''
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_db_dial', 'delete', [Key])
      let id = this.entries.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.entries.splice(id, 1)
      }
    }
  },
}
</script>
