<template>
<table class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Name</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody v-for="param in params">
    <tr>
      <td>{{ param.name }}</td>
      <td>{{ param.value }}</td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
  name: 'admin-params',
  data () {
    return {
      params: []
    }
  },
  methods: {
    query () {
      this.$agent.get_params(List => this.params = List)
    },
  },
  created () {
    this.query()
  }
}
</script>