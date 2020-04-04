<template>
  <div id="app">
    <Chart />
    <ExplainerText />
  </div>
</template>

<script>
import Chart from './components/Chart.vue';
import ExplainerText from './components/ExplainerText.vue';

export default {
  name: 'App',
  components: {
    Chart,
    ExplainerText,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
a {
  color: #008ffb;
}
</style>
