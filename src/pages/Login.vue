<template>
<div class="container">
    <div class="row">
        <div class="offset-md-2 col-lg-5 col-md-7 offset-lg-4 offset-md-3">
            <div class="panel border bg-white">
                <div class="panel-heading">
                    <h3 class="pt-3 font-weight-bold">Web Chat</h3>
                </div>
                <div class="panel-body p-3">
                    <form  @submit.prevent novalidate>
                        <username-field v-model="user.username" />
                        <password-field v-model="user.password" />
                        <button type="button" class="btn btn-primary"
                            :disabled="isSignupButtonDisabled"
                            @click="createLogin">
                            Enter
                        </button>
                    </form>
                                  
                </div>
                <div class="panel-body p-3">
                    <div class="row">
                        <div class="col-6">
                        </div>
                        <div class="col-6">
                              <router-link class="pt-3 font-weight-bold" :to="{ name: 'register_form' }">don't have an account</router-link>
                        </div>
                    </div>
                                  
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { reactive,onBeforeMount, onMounted } from 'vue';
import { inject } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
import UsernameField from "@/components/UsernameField";
import PasswordField from "@/components/PasswordField";
import useFormValidation from "@/modules/useFormValidation";
import useSubmitButtonState from "@/modules/useSubmitButtonState";
export default{
    name:"myLogin",
    components: { UsernameField,PasswordField },
    setup(){
        const sweet_dialog = inject('$swal')
        const router = useRouter()
        let user = reactive({
            username: "",
            password: "",
        });
        onBeforeMount(() => {
            console.log("Before mount");
            });
        onMounted(() => {
            if (localStorage.getItem(process.env.VUE_APP_KEY_STORAGE)) {
                router.push({name:'chat_home'})
                router.go
            }
            console.log("Mounted");  
        });
        const register_form =  () => {
            router.push({ path: '/register' });
            router.go(1);
        }
        const createLogin =  () => {
            try {
                axios.post('http://localhost:5000/api/auth/login', {
                    username:user.username,
                    password:user.password
                    })
                    .then(function (response) {
                        if (response.data.status === false) {
                            sweet_dialog(JSON.stringify(response.data.msg));
                            }
                        if (response.data.status === true) {
                            console.log(response.data.user)
                            localStorage.setItem(process.env.VUE_APP_KEY_STORAGE,JSON.stringify(response.data.user));
                            router.push({'name':'chat_home'});
                            }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch(error) {
                console.log(error)
            }
        }
        const { errors } = useFormValidation();
        const { isSignupButtonDisabled } = useSubmitButtonState(user, errors);

        return{
            user,
            isSignupButtonDisabled,
            router,
            createLogin,
            register_form
        }
    }
}
</script>
<style>
@import '../assets/Login.css';
</style>
