<template>
    <div class="col-md-8 col-xl-6 chat">
        <div class="card welcome_chat">
            <h3>
                Welcome, <span>{{current_user.username}}!</span>
            </h3>
            <h3>Please select a chat to Start messaging.</h3>
        </div>
    </div>
</template>
<script>
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';

export default {
    name:"myWelcomeChat",
    props: {
    current_user: Object,
  },
}
</script>
<style>

.welcome_chat{
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  }
.welcome_chat img {
    height: 20rem;
  }
.welcome_chat span {
    color: #4e0eff;
  }
</style>