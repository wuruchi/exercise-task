<template>
  <div class="container">
    <h1>Albums by Author</h1>
    <section>
      <input type="text" v-model="artistName" placeholder="Enter artist name" @keyup.enter="getAlbums(artistName)">
      <button @click="getAlbums(artistName)">Get Albums</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </section>
    <section>
      <div class="search-error" v-if="error">Error: {{ error.message }}</div>
      <div v-if="loading">Loading...</div>
    </section>
    <section v-if="!errorMessage && !loading">
      <h3>Albums</h3>
      <div v-if="!albums.length">No albums found</div>
      <div v-if="albums.length > 0">Found {{ albums.length }} albums</div>
      <div class="album-cards">
        <div class="album-cards__card" v-for="album in albums" :key="album.albumName">
            <header>{{ album.albumName }}</header>
            <img :src="album.artworkUrl100" alt="Album cover">
            <p>{{ album.artistName }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getAlbumsByArtist } from '../services/albums-api';

export default {
  name: 'MainComponent',
  data() {
    return {
      artistName: '',
      albums: [],
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    async getAlbums(artistName) {
      if (!this.artistName.trim()) {
        this.errorMessage = 'Please enter an artist name';
        return;
      }
      try {
        this.loading = true;
        this.errorMessage = '';
        this.albums = [];
        const albums = await getAlbumsByArtist(this.artistName);
        this.albums = albums;
      } catch (error) {

        // get the body of the error response
        this.errorMessage = JSON.parse(error.message).message;

      } finally {
        this.loading = false;
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  padding: 2.4rem 4.8rem;
}

.search-error {
  border: 1px solid red;
  padding: 1.2rem;
}

section {
  margin-bottom: 2.4rem;
}

.album-cards {
  display: flex;
  flex-wrap: wrap;

  &__card {
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    margin-right: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.2rem;
    width: 200px;

    header {
      font-size: 1.6rem;
      font-weight: bold;
      margin-bottom: 1.2rem;
    }

    img {
      border: 1px solid #ccc;
      border-radius: 0.4rem;
      margin-bottom: 1.2rem;
      width: 100%;
    }
  }
}
</style>
