<template>
  <div class="container">
    <section>
      <h1>Search Albums by Author</h1>
      <input id="search-input" type="text" v-model="artistName" placeholder="Enter artist name" @keyup.enter="getAlbums(artistName)">
      <button id="trigger-button" :disabled="loading" @click="getAlbums(artistName)">Get Albums</button>
    </section>
    <section>
      <div v-if="loading">Loading...</div>
      <span id="error-message" class="search-error" v-if="errorMessage">{{ errorMessage }}</span>
    </section>
    <section v-if="!errorMessage && !loading" class="search-result">
      <div v-if="!albums.length">No albums found</div>
      <div v-if="albums.length > 0">Found {{ albums.length }} albums</div>
      <div v-if="albums.length > 0" class="search-result__header">
        <b>Albums</b>
        <input type="text" v-model="filterCriteria" placeholder="Filter results" @keyup="filterResults">
      </div>
      <div id="results" class="album-cards">
        <div id="results-item" class="album-cards__card" v-for="album in filteredAlbums" :key="album.albumName">
            <header><a :href="album.albumUrl" target="_blank">{{ album.albumName }}</a></header>
            <img :src="album.artworkUrl100" alt="Album cover">
            <p>{{ album.artistName }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getAlbumsByArtist } from '../services/albums-api';
import Fuse from 'fuse.js';

export default {
  name: 'MainComponent',
  data() {
    return {
      artistName: '',
      albums: [],
      filteredAlbums: [],
      loading: false,
      errorMessage: '',
      filterCriteria: '',
      fuse: null
    }
  },
  methods: {
    stateOnSearch() {
      this.albums = [];
      this.filteredAlbums = [];
      this.loading = true;
      this.errorMessage = '';
      this.filterCriteria = '';
      this.fuse = null;
    },
    createIndex() {
      const options = {
        keys: ['albumName', 'artistName'],
        threshold: 0.3 // Lower threshold for better results
      };
      this.fuse = new Fuse(this.albums, options);
    },
    async getAlbums(artistName) {
      if (!this.artistName.trim()) {
        this.errorMessage = 'Please enter an artist name';
        return;
      }
      try {
        this.stateOnSearch();
        const albums = await getAlbumsByArtist(this.artistName);
        this.albums = albums;
        this.createIndex();
        this.filteredAlbums = this.albums;
      } catch (error) {
        this.errorMessage = error;
      } finally {
        this.loading = false;
      }
    },
    filterResults() {
      if (this.filterCriteria.trim() === '') {
        this.filteredAlbums = this.albums;
        return;
      }
      this.filteredAlbums = this.fuse.search(this.filterCriteria).map(result => result.item);
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 2.4rem 4.8rem;
}

.search-error {
  border: 1px solid #ff5000;
  border-radius: 5px;
  margin: 0.4rem 0;
}

.album-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 1.2rem;

  &__card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1.2rem;
    width: 200px;

    header {
      font-size: 1.6rem;
      font-weight: bold;
      margin-bottom: 1.2rem;
    }

    img {
      border: 1px solid #ccc;
      border-radius: 10px;
      width: 100%;
    }
  }
}

.search-result {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.2rem;
  }
}
</style>
