<template>
<div>
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
  <div v-if="computedPaginatePages > 1 && rowsPerPage > 0 && filterKey ===''" class="page-navigation">
    <button @click=movePages(-1)>Back</button>
    <p>{{startRow / rowsPerPage + 1}} / {{computedPaginatePages}}</p>
    <button @click=movePages(1)>Next</button>
  </div>
</div>
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
    rowsPerPage: Number,
    filterKey: String,
    clickable: Number
  },
  data () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      startRow: 0,
      searchQuery: '',
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData () {
      let sortKey = this.sortKey
      let filterKey = this.filterKey && this.filterKey.toLowerCase()
      let order = this.sortOrders[sortKey] || 1
      let data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      let index = this.columns.indexOf(sortKey)
      let newKey = this.dataArguments[index]
      if (newKey) {
        data = data.slice().sort( (a,b) => {
          a = a[newKey]
          b = b[newKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      //paginations when rowsPerPage > 0 or no filtering
      if (this.rowsPerPage == 0 || filterKey)
        return data
      else
        return data.slice(this.startRow, this.startRow + this.rowsPerPage)
    },
    computedPaginatePages () {
      return this.data.length%this.rowsPerPage > 0 ? (Math.round(this.data.length/this.rowsPerPage) + 1)
        : this.data.length/this.rowsPerPage
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    movePages (amount) {
      var row = this.startRow + (amount * this.rowsPerPage);
      if (row >= 0 && row < this.data.length) {
        this.startRow = row;
      }
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
  .page-navigation {
    display: flex;
    width: 150px;
    height: 30px;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .page-navigation p {
    margin-left: 5px;
    margin-right: 5px;
  }
  .page-navigation button {
    background-color: #42b983;
    border-color: #42b983;
    color: rgba(255, 255, 255, 0.66);
  }
</style>