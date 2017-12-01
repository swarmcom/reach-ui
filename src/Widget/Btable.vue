<template>
  <div>
    <div class="row">
      <div class="col">
        <button v-if="add_button" @click="add" class="btn btn-outline-success pointer"><icon class="align-middle" name="plus" scale="1"></icon></button>
      </div>
      <div v-if="paginate" class="col-md-2 float-right">
        <b-form-select :options="pageOptions" v-model="perPage" @input="onSelectChange" />
      </div>
      <div v-if="filter_button" class="col-md-4 float-right">
        <b-form-input v-model="filter" placeholder="Type to Filter" />
      </div>
    </div>
    <b-row style="margin-top: 10px">
      <b-col>
        <b-table striped hover small
          :current-page="currentPage"
          :per-page="perPage"
          :sort-by="sortBy"
          :items="data"
          :fields="fields"
          :filter="filter"
          :sortDesc="sortDesc"
          @row-clicked="onClick"
          @filtered="onFiltered"
          @sort-changed="onSortingChanged">
        </b-table>
      </b-col>
    </b-row>
    <b-pagination align="center" v-if="perPage > 0" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
  </div>
</template>

<script>

export default {
  name: 'btable',
  props: {
    fields: Object,
    data: Array,
    add_button: Boolean,
    filter_button: Boolean,
    paginate: Boolean
  },
  data () {
    return {
      currentPage: 1,
      pageOptions: [
        {text:'All', value:0},
        {text:5,value:5},{text:10,value:10},{text:15,value:15}, {text:20,value:20}, {text:25,value:25}, {text:30,value:30}
      ],
      storageName: '',
      perPage: 0,
      filter: null,
      sortBy: '',
      sortDesc: false,
      totalRows: 0
    }
  },
  methods: {
    add () {
      this.$parent.add();
    },
    onClick (data) {
      if (typeof this.$parent.onClick === "function")  this.$parent.onClick(data)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onSelectChange (value) {
      let dataStore = { "sortBy": this.sortBy, "sortDesc": this.sortDesc, "perPage": value }
      localStorage.setItem(this.storageName, JSON.stringify(dataStore))
    },
    onSortingChanged (ctx){
      let data = { "sortBy": ctx.sortBy, "sortDesc": ctx.sortDesc, "perPage": this.perPage }
      localStorage.setItem(this.storageName, JSON.stringify(data))
    },
    loadDataStorage(name) {
      if(localStorage.getItem(name)) {
        let dataStore = JSON.parse(localStorage.getItem(name));
        this.sortBy = dataStore.sortBy
        this.sortDesc = dataStore.sortDesc
        this.perPage = dataStore.perPage
      }
    }
  },
  created () {
    this.storageName = this.$parent.$options.name
    this.totalRows = this.data.length
    this.sortBy = Object.keys(this.fields)[0]
    this.loadDataStorage(this.storageName)
  },
}
</script>

<style>
  table tbody tr {
    cursor: pointer;
  }
</style>
