<template>
    <div class="login">
        <nav class="nav">
            <div class="nav_wrap">
                
                <img src="@/assets/img/logo.svg" class="nav_logo" alt="budgety">
               
                <ul class="nav_control">
                    <li class="nav_item" v-on:click="showLogIn">Login</li>
                    <li class="nav_item" v-on:click="showSignUp">Sign up</li>
                </ul>
            </div>
        </nav>
        <main class="container">
            <!-- login form -->
            <transition name="scale" tag="div">   
                <div key="1" class="log_form" v-if="logIn">
                    <form class="log_form_wrap" @submit.prevent="login">
                        <h1 class="log_form_name">Login</h1>
                      
                        <div class="group">
                            <label for="log_user" class="group_label">Email</label>
                            <input id="log_user" type="email" v-model="email" class="group_input">
                        </div>
                        <div class="group">
                            <label for="log_pass" class="group_label">Password</label>
                            <input id="log_pass" type="password" v-model="password"  class="group_input">
                        </div>
                        <p v-if="feedback" class="feedback">{{ feedback }}</p>
                        <div class="group">
                            <button class="button">Log in</button>
                        </div>                 
                   
                    </form>
                    <p class="demo"><a href="">Try demo</a></p>
                </div><!-- END login form-->

    <!-- .............................. FLIP ................................. -->

                <!-- sing up form -->
                <div key="2" class="log_form" v-if="singUp"  ><!-- form background -->
                    <form class="log_form_wrap" @submit.prevent="signup">
                        <h1 class="log_form_name">Sign up</h1>

                        <div class="group">
                            <label for="sign_alias" class="group_label">Username</label>
                            <input id="sign_alias" type="text" v-model="alias" class="group_input">
                        </div>

                        <div class="group">
                            <label for="sign_user" class="group_label">Email*</label>
                            <input id="sign_user" type="email" v-model="email" class="group_input">
                        </div>
                        <div class="group">
                            <label for="sign_pass" class="group_label">Password</label>
                            <input id="sign_pass" type="password" v-model="password"  class="group_input">
                        </div>
                        <p v-if="feedback" class="feedback">{{ feedback }}</p>
                        <div class="group">
                            <button class="button">Sign Up</button>
                        </div>
                    
                        <p class="info"> *You don't need to use a real email to sign up. There is no verification. </p>
                    </form>
                    <p class="demo"><a href="http://www.janakoudelkova.cz/store/weby/budgety" target="_blank">Try demo</a></p>
                </div><!-- END  sing up form -->
            </transition>
            <!-- bacground img - animated svg -->
            <div class="back_container">
                <img src="@/assets/img/back-a.svg" alt="" class="img">
                <img src="@/assets/img/back.svg" alt="" class="img">
            </div>
        </main>
        <!-- footer -->
        <footer class="footer">
            <a class="footer_web" href='http://www.janakoudelkova.cz' target="_blank">create by Jana koudelková </a> 
            <a class="footer_img" href='https://www.freepik.com/free-vector/finance-concept-with-colorful-elements_1305299.htm' target="_blank">(image from Freepik)</a>
        </footer>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import slugify from 'slugify'


export default {
    name: 'Login',
    data () {
        return {
            singUp: false,
            logIn: true,
            user: null,
            alias: null,
            email: null,
            password: null,
            feedback: null,
            slug: null,
        }
    },

    methods: {

        showSignUp() {
            this.singUp = true,
            this.logIn = false,
            this.password = "",
            this.email = "",
            this.feedback = ""
        },

        showLogIn() {
            this.singUp = false,
            this.logIn = true
            this.password = "",
            this.email = "",
            this.feedback = ""
        },

        signup(){
            if (this.alias && this.email && this.password) {
                this.feedback = null
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                let ref = db.collection('users').doc(this.slug)
                ref.get().then(doc => {
                    if (doc.exists) {
                        this.feedback = 'This alias already exists'
                    } else {
                        // this alias does not yet exists in the db
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(cred=> {
                            ref.set({
                                alias: this.alias,
                                user_id: cred.user.uid
                            })
                        }).then(() => {
                            db.collection('users').doc(this.slug).get()
                            .then(doc => {
                                this.$router.push({ name: 'Budgety', params: { id: doc.id }})
                            })
                        })
                        .catch(err => {
                            this.feedback = err.message
                        })
                    }
                })
            } else {
            this.feedback = 'Please fill in all fields'
            }
        },

        login(){
            if (this.email && this.password) {
                this.feedback = null
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(cred => {
                    let ref = db.collection('users')
                    ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            this.$router.push({ name: 'Budgety', params: { id: doc.id }})
                        })
                    })
                })
                .catch(err => {
                    this.feedback = err.message
                })
            } else {
                this.feedback = 'Please fill in all fields'
            }
        },
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

.container {
    max-width: $width;
    margin: 0 auto;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: calc(100vh - 100px);
    position: relative;
}

// -- mobil --
@media screen and (max-width: 800px) {
    .container {
        justify-content: center;
    }
}
//form
.log_form {
    position: absolute;
    z-index: 10;
    &_wrap {
        width: 350px;
        padding: 30px 40px;
        border-radius: 8px;
        border-top: 5px solid $color_positive;
        background: $color-bg--light;
        box-shadow: 0 10px 28px 0 rgba($color_text, 0.1);
    }
    &_name {
        color: $color_positive;
        font-size: 1.2em;
        margin: 30px 0;
    }
}

// -- mobil --
@media screen and (max-width: 375px) {
    .log_form_wrap {
        width: 95%;
    }
}

.button {
    text-transform: uppercase;
    border: none;
    margin: 50px 0 30px 0;
	padding: 15px 20px;
	border-radius: 25px;
    background: rgba($color_text, .2);
    width: 100%;
	color: #fff;
    display: block;
    background: $color_positive;
    transition: .5s;
    cursor: pointer;
    &:hover {
        background: darken( $color_positive, 5% );
        box-shadow: 0 10px 20px 0 rgba($color_positive, 0.3);
    }
    &:focus {
        outline: none
    }
}
// info about e-mails
.info {
    font-size: 0.8em;
    color: $color_text;
} 
// demo button
.demo {
    display: inline-block;
    color: $color_positive;
    font-weight: 700;
    padding: 15px;
    margin-top: 15px;
    border-radius: 50px;
    transition: .4s;
    &:hover {
        color: $color_negative;
    }
}
// background images
.back_container {
    position: absolute;
    width: 80%;
    right: 0;
    top: 30%
}

.img {
    width: 100%;
    position: absolute;
   // right: 0;
}


// -- mobil --
@media screen and (max-width: 800px) {
    .back_container {
        top: 0;
        left: 9%;

    }
}




</style>
