<template>
  <div class="search-home">
    <header>
      <h2 class="header">iTunes Search</h2>
    </header>
    <div class="centeralign tune-card">
      <input
        class="input-artist"
        type="text"
        name="artist"
        placeholder="Search for an artist"
        v-model="selectedArtist"
      />
      <button class="search-button" @click="onSubmit">Search</button>
      <input type="text" class="filter-albums" placeholder="Filter albums on type" @keyup="onChange" />
    </div>
    <div class="artists-card">
      <div class="warning" v-show="hasNoData && !hasError">
        <h2>There is no data available</h2>
      </div>
      <div class="warning" v-show="hasError">There is an error</div>
      <div v-for="tune in filteredAlbums" :key="tune.id" v-show="!hasNoData">
        <div class="card">
          <h5 class="card-body">Album - {{ tune.trackName }}</h5>
          <img class="card-image" :src="tune.artworkUrl100" />
          <p class="card-text">{{ tune.artistName }}</p>
          <p class="card-album-name">{{ tune.collectionName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/mixins/generalMixin'

export default {
  name: 'search',
  data () {
    return {
      tuneList: [],
      filteredAlbums: [],
      selectedArtist: '',
      hasNoData: true,
      hasError: false
    }
  },
  methods: {
    onChange (event) {
      if (event.target.value !== '') {
        this.filteredAlbums = [...this.tuneList].filter((tune) => {
          if (tune.trackName !== undefined) {
            return (
              tune.trackName
                .toLowerCase()
                .indexOf(event.target.value.toLowerCase()) !== -1
            )
          }
        })
      } else {
        this.filteredAlbums = [...this.tuneList]
      }
    },
    onSubmit () {
      axios({
        method: 'GET',
        url: 'http://localhost:3000/itunes/search?term=' + this.selectedArtist
      }).then(
        (response) => {
          if (response.data.results.length === 0) {
            this.hasNoData = true
            this.hasError = false
          } else {
            const pluckedResponse = this.pluckResponse(response.data.results)
            this.tuneList = this.getUniqueItems(pluckedResponse, 'trackName')
            this.filteredAlbums = [...this.tuneList]
            this.hasNoData = false
            this.hasError = false
          }
        },
        (error) => {
          // eslint-disable-next-line
          console.error("error", error);
          this.hasError = true
          this.hasNoData = false
          this.tuneList = []
        }
      )
    }
  }
}
</script>

<style scoped>
@import "./Search.scss";
</style>
