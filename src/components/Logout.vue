<template>
    <div class="d-flex bd-highlight">
        <div class="img_cont_self">
            <img :src="`${current_user.avatarImage}`" class="rounded-circle user_img_self">
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-auto me-auto">
                      <div class="user_info_self">
                        <span>{{current_user.username}} <small>#{{current_user.pin}}</small></span>
                      </div>
                </div>
                <div class="col-auto">
                    <div class="user_info_self">
                        <span><i class="fas fa-power-off signout" @click="klikSignOut" title="Keluar dari Chat"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
  import { defineProps,defineEmits} from 'vue'
  defineProps(['current_user','contact_list']);
  const emit = defineEmits(['signout']);

  function klikSignOut() {
          emit("signout")
      }
      </script>
<script>
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
export default {
  name:"myChatLogout"
}
</script>