<template>
<div class="container">
    <div class="row">
        <div class="offset-md-2 col-lg-5 col-md-7 offset-lg-4 offset-md-3">
            <div class="panel border bg-white">
                <div class="panel-heading">
                    <h3 class="pt-3 font-weight-bold">Register User</h3>
                </div>
                <div class="panel-body p-3">
                    <form  @submit.prevent novalidate>
                        <username-field v-model="user.username" />
                        <email-field v-model="user.email" />
                        <password-field v-model="user.password" />
                        <gender-field v-model="user.gender"/>
                        <button type="button" class="btn btn-primary"
                            :disabled="isSignupButtonDisabled"
                            @click="createRegister">
                            Register
                        </button>
                    </form>
                </div>
                <div class="panel-body p-3">
                    <div class="row">
                        <div class="col-8">
                        </div>
                        <div class="col-4">
                              <router-link class="pt-3 font-weight-bold" :to="{ name: 'login' }">have an account</router-link>
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
import EmailField from '@/components/EmailField';
import GenderField from '@/components/GenderField';
import useFormValidation from "@/modules/useFormValidation";
import useSubmitButtonState from "@/modules/useSubmitButtonState";
import {registerRoute,VUE_KEY_STORAGE,getdevice,adddevices} from '../utils/APIRoutes';
export default{
    name:"myRegister",
    components: { UsernameField,PasswordField,EmailField,GenderField },
    setup(){
        const sweet_dialog = inject('$swal')
        const router = useRouter()
        let device_get = reactive({})
        let user = reactive({
            username: "",
            email:"",
            password: "",
            gender:""
        });
        onBeforeMount(() => {
            console.log("Before mount");
            });
        onMounted(async() =>  {
            device_get = await fetchDevice()
            console.log("Mounted",VUE_KEY_STORAGE,registerRoute, device_get.data);  
        });
        const fetchDevice = async () => {
            let res = null
            res = await axios.get(getdevice);
            return res;
        };
        const createRegister =  () => {
            try {
               axios.post(registerRoute,  {
                    username:user.username,
                    email:user.email,
                    password:user.password,
                    gender:user.gender
                    })
                    .then(function (response) {
                        if (response.data.status === false) {
                            sweet_dialog(JSON.stringify(response));
                            }
                        if (response.data.status === true) {
                            console.log(response.data.user)
                            addDevices(response.data.user._id)
                            // localStorage.setItem(process.env.VUE_APP_KEY_STORAGE,JSON.stringify(response.data.user));
                            // router.push({'name':'chat_home'});
                            }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch(error) {
                console.log(error)
            }
        }
        const addDevices =  (id) => {
            try {
                axios.post(adddevices+'/'+id, {
                    device :device_get.data
                    })
                    .then(function (response) {
                        if (response.data.status === false) {
                            sweet_dialog(JSON.stringify(response.data.msg));
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
        const { errors } = useFormValidation();
        const { isSignupButtonDisabled } = useSubmitButtonState(user, errors);

        return{
            user,
            isSignupButtonDisabled,
            router,
            createRegister,
            device_get,
            addDevices
        }
    }
}
</script>
<style>
@import '../assets/Login.css';
</style>