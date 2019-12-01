<template>
  <div id="app">
    <player></player>
<router-view></router-view>


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
