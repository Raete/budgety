<template>
    <div id="budgety">
        <nav class="nav">
            <div class="nav_wrap">
                <img src="@/assets/img/logo.svg" class="nav_logo" alt="budgety">
                <ul class="nav_control">
                    <li class="nav_user"><a>{{person.username}}</a></li>
                    <li class="nav_item"><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </nav>
        <main class="container">
            <!-- total budget, incomes and expenses -->
            <section class="summary">
                <div class="summary_item ">
                    <h1 class="summary_title">Available budget</h1>
                    <p class="summary_num">{{formatNub(budget.totalBudget)}}</p>
                </div>
                <div class="summary_item summary_item--inc">
                   <h1 class="summary_title">Incomes</h1>
                    <p class="summary_num">+ {{formatNub(budget.totalInc)}}</p>
                </div>
                <div class="summary_item summary_item--exp">
                    <h1 class="summary_title">Expenses</h1>
                    <p class="summary_num">- {{formatNub(budget.totalExp)}}</p>
                </div>
            </section>
            <!-- form - add transaction -->
            <form class="add_container"  @submit.prevent="addTransaction">
                <div class="switcher">
                    <input @change="type()"  type="radio" name="balance" value="inc" id="income" class="switcher_input switcher_input--inc" v-model="inputs.type" checked>
                    <label for="income" class="switcher_label" v-bind:class="changeColorLabel()">Incomes</label>
                    
                    <input @change="type()" type="radio" name="balance" value="exp" id="expenses" class="switcher_input switcher_input--exp" v-model="inputs.type">
                    <label for="expenses" class="switcher_label">Expenses</label>
                    
                    <span class="switcher_toggle" v-bind:class="changeBackground()"></span>
                </div>
                <div class="group">
                    <label for="inputValue" class="group_label">Value</label>
                    <input id="inputValue" type="number" ref="value" v-model="inputs.value" class="group_input group_val">
                </div>
                <div class="group">
                    <label for="inputDes" class="group_label">Description</label>
                    <input id="inputDes" type="text" v-model="inputs.title"  class="group_input group_des">
                </div>
            
                <button class="add_btn" v-bind:class="changeBackground()">add</button>
            </form>
            <!-- transaction list -->
            <section class="transaction">
                <ul class="transaction_list">
                    <li class="transaction_item" v-for="transaction in transactions" :key="transaction.id">
                        <div class="item_des">
                            <span class="item_date">{{transaction.date}}</span>
                            <h1 class="item_text">{{transaction.title}}</h1>                        
                        </div>
                        <div class="item_value">
                            <div class="item_num" v-bind:class="transaction.color">{{transaction.mark}}  {{formatNub(transaction.value)}}</div>
                            <img @click="deleteTransaction(transaction.id)" class="item_delete" src="@/assets/img/delete.svg" alt="">
                        </div>
                    </li>
                </ul>
                <p class="feedback" v-bind:class="changeColorFeedback()">{{person.feedback}}</p>
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
                feedback: null, 
            },
            inputs: {
                type: "inc",
                title: null,  
                value: null 
            },
            transactions: [],
            budget: {
                inc: [],
                exp: [],
                totalInc: 0,
                totalExp: 0,
                totalBudget: 0
            },
        }
    },

    created(){
        // get current user from firebase
        db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.person.user = doc.data()
                this.person.user.id = doc.id
            })
        })
        // data from current user
        db.collection('users').doc(this.$route.params.id).get()
        .then(user => {
            this.person.profile = user.data()
            this.person.username = this.person.profile.alias
        })   
        // render current user's transactions from firebase to the DOM
        db.collection('transactions').where('from', '==', this.$route.params.id).orderBy('date')
            .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    let transaction = change.doc.data()
                    transaction.id = change.doc.id
                    this.transactions.unshift(transaction) 
                }          
            })
        })
        // calculate and update total inc, exp and total budget (real time)
        db.collection('transactions')
        .where('from', '==', this.$route.params.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    // if income transaction add
                    if (change.doc.data().type == "inc") {
                        this.budget.inc.push(change.doc.data().value) 
                        this.budget.totalInc = this.sumValues(this.budget.inc)
                    // if expense transaction add
                    } else if (change.doc.data().type == "exp") {
                        this.budget.exp.push(change.doc.data().value) 
                        this.budget.totalExp = this.sumValues(this.budget.exp)
                    }
                }
                if (change.type == 'removed') {
                    // if income transaction delete
                    if (change.doc.data().type == "inc") {
                        let index = this.budget.inc.indexOf(change.doc.data().value)
                        this.budget.inc.splice(index, 1) 
                        this.budget.totalInc = this.sumValues(this.budget.inc)
                    // if expense transaction delete
                    } else if (change.doc.data().type == "exp") {
                        let index = this.budget.exp.indexOf(change.doc.data().value)
                        this.budget.exp.splice(index, 1) 
                        this.budget.totalExp = this.sumValues(this.budget.exp)
                    }
                }
                // calculate available budget
                this.budget.totalBudget = this.budget.totalInc - this.budget.totalExp
            })
        })
    },

    updated(){
        // feedback - if no transactions
        db.collection('transactions').where('from', '==', this.$route.params.id).get()
        .then(snapshot => {
            if (snapshot.size == 0) {
                this.person.feedback = "Add your first transaction."
            } else {
                this.person.feedback = null
            }
        })    
    },

    mounted(){
        // start with cursor in value input
        this.setFocus()
    },

    methods: {
        // logout current user redirect to login page
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login'})
            })
        },
        //** calculate budget **//
        // sum values in array
        sumValues(sum){
            sum = sum.reduce((a, b) => a + b, 0);
            return sum
        },
        // format numbers
        formatNub(num){ 
            num = Math.abs(num);
            num = num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            return num
        },

        //** change color **//
        type(){},
        // color changer
        changeBackground(){
            if (this.inputs.type == "exp") {
                return "background--exp"
            } 
        },
        changeColorLabel(){
            if (this.inputs.type == "exp") {
                return "color--inc"
            } 
        },
        changeColorFeedback(){
            if (this.inputs.type == "exp") {
                return "color--exp"
            } 
        },
        setColorClass(){
            if (this.inputs.type == "inc") {
               return "color--inc"

            } else if (this.inputs.type == "exp") {
                return "color--exp"
            }
        },
        // set income or expense mark
        setMark(){
            if (this.inputs.type == "inc") {
                return "+"
            } else {
                return "-"
            }
        },
        setFocus(){
            this.$refs.value.focus();
        },
        //** add and delete transactions **//
        // get data from inputs fields and add them to the firestore
        addTransaction(){
            if (this.inputs.title && this.inputs.value) {
                this.person.feedback = null
        
                db.collection('transactions').add({
                    from: this.$route.params.id,
                    type: this.inputs.type,
                    mark: this.setMark(),
                    color: this.setColorClass(),
                    date: moment(Date.now()).format('ll'),
                    title: this.inputs.title,
                    value: Number(this.inputs.value),

                }).then(() => {
                    this.inputs.title = ""
                    this.inputs.value = ""
                    this.setFocus()

                }).catch(err => {
                    console.log(err)
                })

            } else {
                this.person.feedback = 'You must fill in all fields'
            }
            this.setMark()
            this.person.feedback = null
        },

        // delete data from firestore and DOM
        deleteTransaction(id){
          db.collection('transactions').doc(id).delete()
            .then(() => {
                this.transactions = this.transactions.filter(transaction => {
                return transaction.id != id
                })
            }).catch(err => {
                console.log(err)
            })
        }, 
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
        &:last-child {
            border-bottom: 0
        }
    }
}

.item {
    &_date {
        font-size: .9em;
        color: darken( $color-bg--light, 40% );
    }
    &_delete {
        cursor: pointer;
    }
    &_text {
        font-size: 1em;
    }
    &_value {
        display: flex;
    }
    &_num {
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
}

// color change
.color--inc {
    color: $color_positive;
}

.color--exp {
    color: $color_negative;
}

.background {
    &--exp {
        background: $color_negative;
        &:hover {
            background: darken( $color_negative, 5% );
            box-shadow: 0 10px 20px 0 rgba($color_negative, 0.3);
        }
    }
}

.feedback {
    color: $color_positive;
    font-size: 0.8em;
    text-align: center;
}
</style>
