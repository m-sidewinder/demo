<template>
  <div class="text-center mt-4 mb-2">
    <img class="img-fluid" alt="The logo" src="./assets/logo.png">
  </div>

  <HelloWorld msg="Demo front-end application"/>
  <hr/>
  <path-finder ehost="http://mproxy.hotelmatrix.report/prolog/path"></path-finder>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PathFinder from "@/components/PathFinder.vue";

export default {
  name: 'App',
  components: {
    PathFinder,
    HelloWorld
  }
}
</script>

<style>

</style>
