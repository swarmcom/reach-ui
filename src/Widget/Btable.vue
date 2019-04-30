<template>
  <div>
    <b-row>
      <b-col>
        <button
          v-if="addButton"
          :title="tooltip"
          class="btn btn-outline-success pointer"
          @click="add"
        >
          <icon
            class="align-middle"
            name="plus"
            scale="1"
          />
        </button>
      </b-col>
      <b-col
        v-if="paginate"
        class="float-right"
        md="2"
      >
        <b-form-select
          v-model="perPage"
          :options="pageOptions"
          @input="onSelectChange"
        />
      </b-col>
      <b-col
        v-if="filterButton"
        class="float-right"
        md="4"
      >
        <b-form-input
          :value="filter"
          :state="filterState"
          placeholder="Type to Filter"
          @input="onFilterUpdate"
        />
      </b-col>
    </b-row>
    <b-row style="margin-top: 10px">
      <b-col>
        <b-table
          striped
          hover
          small
          tbody-tr-class="pointer"
          :current-page="currentPage"
          :per-page="perPage"
          :sort-by="sortBy"
          :items="data"
          :fields="fields"
          :filter="filter"
          :sort-desc="sortDesc"
          @row-clicked="onClick"
          @filtered="onFiltered"
          @sort-changed="onSortingChanged"
        />
      </b-col>
    </b-row>
    <b-pagination
      v-if="perPage > 0"
      v-model="currentPage"
      align="center"
      :total-rows="totalRows"
      :per-page="perPage"
    />
  </div>
</template>

<script>

export default {
  name: 'Btable',
  props: {
    fields: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Array,
      default: () => ([])
    },
    addButton: {
      type: Boolean,
      default: false
    },
    filterButton: {
      type: Boolean,
      default: false
    },
    paginate: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String,
      default: ""
    }
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
      totalRows: 0,
      filterState: null
    }
  },
  created () {
    this.storageName = this.$parent.$options.name
    this.totalRows = this.data.length
    this.sortBy = Object.keys(this.fields)[0]
    this.loadDataStorage(this.storageName)
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
    onFilterUpdate (event){
      if (event.match(/[^\w\s]/gi)) {
        this.filter = event.replace(/[^\w\s]/gi, '')
        this.filterState = false
      }
      else {
        this.filter = event
        this.filterState = null
      }
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
}
</script>
