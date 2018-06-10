<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
@import 'assets/scss/_variables';

html {
    box-sizing: border-box;
}

*, *:before, *:after {
    box-sizing: inherit;
}

*:focus {
    outline: none;
}

html,
body {
    font-family: $main_font;
    height: 100vh;
    background: $color-bg
}

ul, body, h1, h2 {
    margin: 0;
    padding: 0;
}

li {
    list-style: none;
}

a {
    text-decoration: none;
    color: inherit;
}

</style>
