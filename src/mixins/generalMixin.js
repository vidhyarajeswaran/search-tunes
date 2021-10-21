import Vue from 'vue'

Vue.mixin({
  methods: {
    getUniqueItems (arr, key) {
      return [...new Map(arr.map(item => [item[key], item])).values()]
    },
    pluckResponse (response) {
      return response.map(({ artistName, artworkUrl100, collectionName, trackName }) => ({ artistName, artworkUrl100, collectionName, trackName }))
    }
  }
}
)
