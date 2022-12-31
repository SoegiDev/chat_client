<template>
<div class="container">
    <div class="row">
        <div class="offset-md-2 col-lg-5 col-md-7 offset-lg-4 offset-md-3">
            <div class="panel border bg-white">
                <div class="panel-heading">
                    <h3 class="pt-3 font-weight-bold">Web Chat Login</h3>
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
import {loginRoute,VUE_KEY_STORAGE,getdevice,removeDevice} from '../utils/APIRoutes';
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
        let device_get = reactive({})
        let user = reactive({
            username: "",
            password: "",
        });
        onBeforeMount(() => {
            console.log("Before mount");
            });
        onMounted(async() => {
            device_get = await fetchDevice()
            if (localStorage.getItem(VUE_KEY_STORAGE)) {
                router.push({name:'chat_home'})
                router.go
            }
           
            console.log("Mounted ",VUE_KEY_STORAGE,loginRoute, device_get);  
        });
        const register_form =  () => {
            router.push({ path: '/register' });
            router.go(1);
        }
        const fetchDevice = async () => {
            let res = null
            res = await axios.get(getdevice);
            return res;
        };
        const createLogin =  () => {
            try {
                axios.post(loginRoute, {
                    username:user.username,
                    password:user.password,
                    device :device_get.data
                    })
                    .then(function (response) {
                        if (response.data.status === false) {  
                            let message = response.data.msg
                            if(!message.includes("Incorrect Username or Password")){
                                sweet_dialog.fire({
                                title: " "+JSON.stringify(response.data.msg),
                                showDenyButton: true,
                                confirmButtonText: 'Logout another Device',
                                denyButtonText: 'No',
                                customClass: {
                                    actions: 'my-actions',
                                    confirmButton: 'order-1',
                                    denyButton: 'order-2',
                                }
                                }).then((result) => {
                                if (result.isConfirmed) {
                                    removeDevices(response.data.user._id,response.data.device._id)
                                    // sweet_dialog.fire('Saved!', '', 'success')
                                } else if (result.isDenied) {
                                    sweet_dialog.fire('Changes are not saved', '', 'info')
                                }
                                })
                            }else{
                                sweet_dialog(JSON.stringify(response.data.msg));
                            }
                            
                            }
                        if (response.data.status === true) {
                            console.log(response.data.user)
                            localStorage.setItem(VUE_KEY_STORAGE,JSON.stringify(response.data.user));
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
        const removeDevices =  (id,device) => {
            try {
                axios.post(removeDevice+'/'+id+'/'+device, {})
                    .then(function (response) {
                        if (response.data.status === false) {
                            console.log(response.data.msg)
                            sweet_dialog(JSON.stringify(response.data.msg));
                            }
                        if (response.data.status === true) {
                            console.log(response.data)
                            createLogin()
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
            register_form,
            device_get,
            removeDevices
        }
    }
}
</script>
<style>
@import '../assets/Login.css';
</style>
