<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Dialplan:</h3></div></div>
  <div v-for="dial of dials" class="form-row">
    <div class="for_group col-1">
      <button @click="del(dial.id)" class="btn btn-outline-danger"><icon name="minus" scale="1"></icon></button>
    </div>
    <div class="form-group col-5">
      <input type="text" class="form-control" v-model="dial.match">
    </div>
    <div class="form-group col">
      <lines v-model="dial.line_in_id"></lines>
    </div>
    <div class="col">
      Queue: {{ dial.line_in.queue.name }}, Client: {{ dial.line_in.client.name }}
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
    </div>
    <div class="form-group col-5">
      <input type="text" class="form-control" v-model="k">
    </div>
    <div class="form-group col">
      <lines v-model="v"></lines>
    </div>
  </div>
</div>
</template>

<script>
import LineIns from '../Widget/LineIns.vue'

export default {
  name: 'admin-dials',
  components: {
    lines: LineIns
  },
  data () {
    return {
      k: undefined,
      v: undefined,
      dials: []
    }
  },
  methods: {
    query: async function () {
      this.dials = await this.$agent.p_mfa('ws_admin', 'get_dials')
    },
    add: async function() {
      let dial = await this.$agent.p_mfa('ws_admin', 'create_dial', [{ match: this.k, line_in_id: this.v }])
      this.dials.push(dial)
      this.k = ''
      this.v = ''
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_admin', 'delete_dial', [Key])
      let id = this.dials.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.dials.splice(id, 1)
      }
    }
  },
  created () {
    this.query()
  },
}
</script>
