<template>
    <div class="login">
        <nav class="nav">
            <div class="nav_wrap">
                <h1 class="nav_logo">budgety.</h1>
                <ul class="nav_control">
                    <li class="nav_item" v-on:click="showLogIn">Login</li>
                    <li class="nav_item" v-on:click="showSignUp">Sign up</li>
                </ul>
            </div>
        </nav>
        <main class="container">
            <div class="content">
                <transition-group name="scale" >  
                    <div key="1" v-if="logIn" class="form_wrap">
                    
                            <form class="form">
                                <h1 class="form_title">Login</h1>
                                <div class="group">
                                    <label for="user" class="group_label">Email*</label>
                                    <input id="user" type="email" v-model="email" class="group_input">
                                </div>
                                <div class="group">
                                    <label for="pass" class="group_label">Password</label>
                                    <input id="pass" type="password" v-model="password"  class="group_input">
                                </div>
                                <p v-if="feedback" class="feedback">{{ feedback }}</p>
                                <div class="group">
                                    <button class="button">Log in</button>
                                </div>
                                <p class="info">*You don't need to use a real email to sign up. <br> There is no verification.</p>
                            </form>
                            <a href="" class="demo">try demo</a>
                     
                    </div>

                    <div key="2" v-if="singUp" class="form_wrap">
                      
                            <form class="form">
                                <h1 class="form_title">singup</h1>
                                <div class="group">
                                    <label for="user" class="group_label">Email*</label>
                                    <input id="user" type="email" v-model="email" class="group_input">
                                </div>
                                <div class="group">
                                    <label for="pass" class="group_label">Password</label>
                                    <input id="pass" type="password" v-model="password"  class="group_input">
                                </div>
                                <p v-if="feedback" class="feedback">{{ feedback }}</p>
                                <div class="group">
                                    <button class="button">Log in</button>
                                </div>
                                <p class="info">*You don't need to use a real email to sign up. <br> There is no verification.</p>
                            </form>
                            <a href="" class="demo">try demo</a>
                
                    </div>
                </transition-group> 
                
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'Login',
        data () {
        return {
            singUp: true,
            logIn: false,
        }
    },
    methods: {

        showSignUp() {
            this.singUp = true,
            this.logIn = false
        },

        showLogIn() {
            this.singUp = false,
            this.logIn = true
        }
    }
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';

// -- transition forms --
.scale-enter-active {
  transition: all .8s ease;
}
.scale-leave-active {
  transition: all .1s ease;
}

.scale-enter {
  transform:  scale(0.9);
  opacity: 0;
}

.scale-leave-to {
  opacity: 0;
}


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
        padding: 0 15px;
    }
    &_control {
        display: inline-block
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

.container {
    max-width: $width;
    margin: 0 auto;
    height: calc( 100vh - 58px);
    display: flex;
    justify-content: start;
    align-items: center;

}

.content {
    width: 100%;
    margin-top: 150px;
    position: relative;
    display: flex;
    justify-content: space-between;
    &_img {

        box-shadow: 0 10px 28px 0 rgba($color_text, .08);
    }
}



.form_wrap {
    margin-left: 20px;
   position: relative;

}

.form {
    max-width: 400px;
    padding: 30px;
    border-radius: 8px;
    background: $color-bg--light;
    box-shadow: 0 10px 28px 0 rgba($color_text, .08);
    &_title {
        color: $color_positive;
        font-size: 1.5em;
        font-weight: 400;
        margin-bottom: 50px;
        text-transform: uppercase;
    }
}

.group {
    margin-bottom: 15px;
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
        color:$color_text;
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

.button {
    text-transform: uppercase;
    border: none;
	padding: 15px 20px;
	border-radius: 25px;
    background: $color_positive;
    width: 100%;
	color: $color-bg--light;
    display: block;
    margin-top: 50px;
    transition: 0.4s;
    cursor: pointer;
    &:focus {
        outline: none
    }
    &:hover {
        background: darken( $color_positive, 3% );
        box-shadow: 0 10px 20px 0 rgba($color_positive, .3);
    }
}

.info {
    font-size: 0.8em;
    color: $color_text;
} 

.demo {
    display: inline-block;
    position: absolute;
    right: 0;
    font-weight: 700;
    color: $color_positive;
    padding: 15px;
}

</style>
