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

p, ul, body, h1, h2 {
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

button {
    border: 0;
}

// navbar
.nav {
    background: $color-bg--light;
    box-shadow: 0 4px 8px 0 rgba($color_text, .03);
    border-bottom: 1px solid $color_bg--darken;
    position: relative;
    &_wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: $width;
        margin: 0 auto;
    }
    &_logo {
        height: 45px;
        padding: 0 15px;
    }
    &_control {
        display: inline-block
    }
    &_user {
        display: inline-block;
        padding: 15px;
        overflow: hidden;
    }
    &_item {
        display: inline-block;
        padding: 15px;
        transform: perspective(1px) translateZ(0);
        position: relative;
        overflow: hidden;
        cursor: pointer;
        &:hover {
            color:$color_positive;
        }
        &:before {
            content: "";
            position: absolute;
            z-index: -1;
            left: 0;
            right: 100%;
            top: 0;
            background: $color_positive;
            height: 4px;
            transition-property: right;
            transition-duration: 0.3s;
            transition-timing-function: ease-out;
        }
        &:hover:before, &:focus:before, &:active:before {
            right: 0;
        }
    }
}
// inputs
.group {
    margin-bottom: 15px;
     width: 100%;
    &_label {
        text-transform: uppercase;
        width: 100%;
        color: #fff;
        display: block;
        color: rgba($color_text, .8);
        font-size: 12px;
        text-transform: uppercase;
        width: 100%;
        display: block;
    }
    &_input {
        width: 100%;
        color: $color_text;
        display: block;
        border: none;
        padding: 15px 20px;
        border-radius: 25px;
        background: $color-bg;
        &:focus {
            outline: none
        }
    }
}
// footer
.footer {
    text-align: center;
    font-size: .8em;
    padding: 10px;
    &_web {
        margin-right: 20px;
        transition: .4s;
        &:hover {
            color: $color_positive;
        }
    }
    &_img {
        color: darken( $color-bg--light, 30% );
    }
}

// feedback
.feedback {
    color: $color_negative;
    font-size: 0.8em;
    text-align: center;
}


</style>
