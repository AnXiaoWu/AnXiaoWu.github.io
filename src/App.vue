<template>
  <div id="app">
<router-view></router-view>
<player></player>

  </div>
</template>
<script>

import player from './components/player/player.vue'
export default {
  name: 'app',
  components: {
    player
  }
}                                  
</script>

<style>
#app {

}
</style>
