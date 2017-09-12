<template>
<table class="table-hover">
    <thead>
      <tr>
        <th v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-bind:class="{ cursor: clickable }" v-for="entry in filteredData" @click="clickable > 0 ? $parent.onClicked(entry) : ''">
        <td v-for="key in dataArguments">
          {{defined(entry[key])}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Common from '../Admin/Common'
export default {
  name: 'custom-table',
  mixins: [Common],
  props: {
    data: Array,
    columns: Array,
    dataArguments: Array,
    filterKey: String,
    clickable: Number
  },
  data: function () {
      var sortOrders = {}
      this.columns.forEach(function (key) {
        sortOrders[key] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      //console.log("sortKey"+sortKey);
      let index = this.columns.indexOf(sortKey)
      let newKey = this.dataArguments[index]
      if (newKey) {
        data = data.slice().sort(function (a, b) {
          a = a[newKey]
          b = b[newKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
    },
    filters: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    methods: {
      sortBy: function (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      }
    }
}
</script>

<style>
  table {
    width: 100%;
    border: 2px solid #42b983;
    border-radius: 3px;
    background-color: #fff;
  }

  th {
    background-color: #42b983;
    color: rgba(255,255,255,0.66);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  th.active {
    color: #fff;
  }

  th.active .arrow {
    opacity: 1;
  }

  tr.cursor {
      cursor: pointer;
  }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #fff;
  }

  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
  }
</style>