<template>
    <div id="budgety">
        <nav class="nav">
            <div class="nav_wrap">

                   <h1 class="nav_logo">budgety.</h1>

                <ul class="nav_control">
                    <li class="nav_user"><a>{{person.username}}</a></li>
                    <li class="nav_item"><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </nav>
        <main class="container">
            <section class="summary">
                <div class="summary_item ">
                    <h1 class="summary_title">Available budget</h1>
                    <p class="summary_num">+ 20.00</p>
                </div>
                <div class="summary_item summary_item--inc">
                   <h1 class="summary_title">Incomes</h1>
                    <p class="summary_num">+ 2,000.00</p>
                </div>
                <div class="summary_item summary_item--exp">
                    <h1 class="summary_title">Expenses</h1>
                    <p class="summary_num">+ 2,000.00</p>
                </div>
            </section>
            <form class="add_container"  @submit.prevent="addTransaction">
                <div class="switcher">
                    <input @change="color()"  type="radio" name="balance" value="inc" id="income" class="switcher_input switcher_input--inc" v-model="inputs.type" checked>
                    <label for="income" class="switcher_label">Incomes</label>
                    
                    <input @change="color()" type="radio" name="balance" value="exp" id="expenses" class="switcher_input switcher_input--exp" v-model="inputs.type">
                    <label for="expenses" class="switcher_label">Expenses</label>
                    
                    <span class="switcher_toggle" v-bind:class="{ }"></span>
                </div>
                <div class="group">
                    <label for="sign_user" class="group_label">Value</label>
                    <input id="sign_user" type="number" v-model="inputs.value" class="group_input group_val">
                </div>
                <div class="group">
                    <label for="sign_pass" class="group_label">Description</label>
                    <input id="sign_pass" type="text" v-model="inputs.title"  class="group_input group_des">
                </div>
            
                <button class="add_btn" v-bind:class="{}">add</button>
            </form>
            <section class="transaction">
                <ul class="transaction_list">
                    <li :data-id="itemId" class="transaction_item" v-for="transaction in transactions" :key="transaction.id">
                        <div class="item_des">
                            <span class="item_date">{{transaction.date}}</span>
                            <h1 class="item_text">{{transaction.title}}</h1>{{transaction.id}}
                           
                        </div>
                        <div class="item_value">
                            <div class="item_num" v-bind:class="{  }">{{transaction.value}}</div>
                            <img @click="deleteTransaction(transaction.id)" class="item_delete" src="@/assets/img/delete.svg" alt="">
                        </div>
                    </li>
                </ul>
                {{person.feedback}} <br>

                
               
                
             
            </section>
        </main>

    </div>
</template>



<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'

export default {
    name: 'Budgety',
    data () {
        return {
            person: { 
                profile: null,
                user: null,
                username: null,  
                feedback: "You have no transaction", 
            },
            inputs: {
                type: null,
                title: null,  
                value: null 
            },

            transactions: [ ],
itemId: null
            

        }
    },
    created(){
        let ref = db.collection('users')

        // current user
        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.person.user = doc.data()
                this.person.user.id = doc.id
            })
        })

        // data from current user
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.person.profile = user.data()
            this.person.username = this.person.profile.alias
        })    

        // watch added transactions from current user
        db.collection('transactions').where('from', '==', this.$route.params.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if(change.type == 'added'){
                    this.transactions.push({
                        from: change.doc.data().from,
                        title: change.doc.data().title,
                        date: moment(change.doc.data().time).format('lll'),
                        type: change.doc.data().type,
                        value: change.doc.data().value,
                        id: change.doc.data().id,
                    })
                }
            })
        })

       
        // get transaction id
        db.collection('transactions').where('from', '==', this.$route.params.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                let transaction = doc.data()
                transaction.id = doc.id
                //console.log(transaction.id)
            
            })
        })
    
    },

    mounted(){

    },

    methods: {
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login'})
            })
        },

        addTransaction(){
        
            if (this.inputs.title && this.inputs.value) {
                this.person.feedback = null

                db.collection('transactions').add({
                    from: this.$route.params.id,
                    title: this.inputs.title,
                    date: Date.now(),
                    value: this.inputs.value,
                    type: this.inputs.type,
                  
                }).then(doc => {
                    
                    this.inputs.title = null
                    this.inputs.value = null
                })
            } else {
                this.person.feedback = 'You must add value and description'
            }
        },

        deleteTransaction(id){
            console.log(id)
          
        }
    }
}
</script>


<style lang='scss' scoped>
@import '../assets/scss/_variables';
@import '../assets/scss/_form';

.container {
    max-width: $width;
    margin: 0 auto;
    padding: 0 15px;
}

.summary {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 15px;
    justify-content: center;
    margin-top: 50px;
    &_title {
        font-size: .4em;
        font-weight: 400;

    }
    &_item {
        min-width: 230px;
        background: $color-bg--light;
        box-shadow: 0 0px 5px 0 rgba($color_text, 0.1);
        border-radius: $radius;
        font-size: 2em;
        font-weight: 700;
        text-align: center;
        padding: 20px 40px;
        &--inc {
            color: $color_positive
        }
         &--exp {
            color: $color_negative
        }
    }
}

// -- mobil --
@media screen and (max-width: 800px) {
    .summary {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-row-gap: 15px;

    }
}

.transaction {
    background: $color-bg--light;
    box-shadow: 0 0px 5px 0 rgba($color_text, 0.1);
    border-radius: $radius;
    padding: 20px;
    &_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dotted darken( $color-bg--light, 20% );
        padding: 10px 0;
    }
}

.item_date {
    font-size: .9em;
    color: darken( $color-bg--light, 40% );
}

.item_text {
    font-size: 1em;
}

.item_value {
    display: flex;
}

.background {
    background: $color_negative
}

.color {
    color: $color_negative
}

.item_num {
    font-size: 1em;
    font-weight: 700;
    margin-right: 20px;
    &--inc {
        color: $color_positive
    }
    &--exp {
        color: $color_negative
    }
}

</style>
