<template>
  <div class="card card-body text-center">
    <h1>{{ msg }}</h1>
    <p>
      The goal of this project is to be an interface for demonstrating logic algorithms.
      All logic is applied on external server, this application only send requests and show solutions.
    </p>

    <div class="mcont">
      <h3>External languages and servers</h3>
      <ul class="list-group">
        <li class="list-group-item">
          <a href="https://getbootstrap.com/">Bootstrap</a> is used for make responsive web design
        </li>
        <li class="list-group-item"> <a href="https://www.swi-prolog.org/">prolog</a> </li>
        <li class="list-group-item"> <a href="https://www.erlang.org/">erlang</a> </li>
      </ul>
      <h3>Links</h3>
      <ul  class="list-group">
        <li class="list-group-item" ><a href="https://stumblefaves.wordpress.com/" target="_blank" rel="noopener">blog (ru)</a></li>
      </ul>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mcont {
  width: max(400px, 60%);
  text-align: start;
  margin: 0 auto;
}
</style>
