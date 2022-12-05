<template>
  <div class="col-md-4 col-xl-3 chat">
    <div class="card mb-sm-3 mb-md-0 contacts_card">
        <div class="card-header">
          <div class="row">
            <div class="col">
            </div>
            <div class="col-6">
              <div class="user_online">
                <i class="fas fa-user white-on-color"></i><small class="text-white font-online-user"> {{friend_list.total_user}} </small><p><small class="text-white">is online</small></p>
              </div>
            </div>
            <div class="col">
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="input-group">
                <input type="text" v-model="search_contact" placeholder="Search..." name="" class="form-control search">
                <div class="input-group-prepend">
                </div>
                <span class="input-group-text search_btn"><i class="fas fa-search"></i></span>
                 <span class="input-group-text add_btn" title="Tambah Teman" @click="showModal"><i class="fa fa-user-plus" ></i></span> 
                   <span class="input-group-text add_btn" title="Tambah Channel" @click="showModalChannel"><i class="fa fa-layer-group"></i></span> 
              </div>
            </div>
            <div class="col">
            </div>
          </div>
        </div>
        <div class="card-body contacts_body">
          <ul class="contacts" v-for="u in filteredAndSorted" :key="u._id">
            <li @click="clickUser(u)" :class="selected_user._id === u._id ?selected.value:null">
              <div class="d-flex bd-highlight">
                <div class="img_cont">
                  <img v-if="u.type==='channel'" :src="`${u.avatarImage}`" class="rounded-circle user_img_channel">
                  <img v-else :src="`${u.avatarImage}`" class="rounded-circle user_img">
                  <template v-if="u.type==='person'">
                    <span v-if="u.connected" class="online_icon"/>
                    <span v-else class="online_icon offline"/>
                  </template>
                </div>
                <div class="user_info">
                  <span>
                    {{u.username}}<small v-if="u.countMessage>0" class="text-white new-messages">{{u.countMessage}}</small>
                    <p v-if="typing.from_typing === u._id && typing.to_typing === current_user._id && typing.isTyping"><small class="text-white">is Typing ...</small></p>
                    <p v-else>#{{u.pin}}</p>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="card-footer">
          <logout
            :friend_list="friend_list"
            :current_user="current_user"
            @signout="klikSignOut"
          />
        </div>
        <Modal
          v-show="isVisibleModal"
          @close="closeModal"
          :current_user="current_user"
        />
        <ModalChannel
          v-show="isVisibleModalChannel"
          @closeModalChannel="closeModalChannel"
          :current_user="current_user"
        />
      </div>
  </div>

</template>
<script setup>
  import Modal from '../modal/add_user.vue';
  import ModalChannel from '../modal/add_channel.vue';
  import { defineProps,defineEmits,ref,computed,defineComponent,toRefs} from 'vue'
  defineComponent([Logout,Modal,ModalChannel])
  // defineProps(['current_user','friend_list','typing']);
  const props = defineProps({
    current_user: null,
    friend_list:null,
    typing:null
  })
  const { current_user,friend_list,typing } = toRefs(props);
  const emit = defineEmits(['sign_out','changeChat','newFriend','newChannel']);
  const selected_user = ref(JSON)
  const style_select = ref(null)
  let search_contact = ref('')
  let isVisibleModal = ref(false)
  let isVisibleModalChannel = ref(false)
  function klikSignOut() {
          emit("sign_out")
      }

  function clickUser(user){
    selected_user.value = user;
    style_select.value = 'selected';
    emit('changeChat',user);
  }
  function showModal() {
    isVisibleModal.value = true;
    }
  function closeModal() {
      isVisibleModal.value = false;
      emit('newFriend',true)
      }
  function showModalChannel() {
    isVisibleModalChannel.value = true;
    }
  function closeModalChannel() {
      isVisibleModalChannel.value = false;
      emit('newChannel',true)
      }
  const selected = computed(() => style_select);
  let filteredAndSorted = computed(()=>{
   function compare(a, b) {
       if (a.username < b.username) return -1;
       if (a.username > b.username) return 1;
       return 0;
     }
      return props.friend_list.contacts.filter(user => {
      return user.username.indexOf(search_contact.value) > -1
     }).sort(compare)
     

  });
</script>
<script>
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import Logout from '../components/Logout.vue';
export default {
  components: { Logout },
  name:"myChatContact"
}
</script>
<style>
 @import '../assets/App.css';
 .new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 2px;
  text-align: center;
  float: right;
  margin-top: 2px;
    margin-left: 10px;
}
.white-on-color {color:rgb(230, 224, 224);}
.user_online{
  margin-top: auto;
  margin-bottom: 5px;
  margin-left: 15px;
}
.user_online p{
  font-size: 15px;
  color: rgba(250, 244, 244, 0.6);
  }
.user_online .font-online-user{
   margin-left: 15px;
  font-size: 15px;
  color: rgba(250, 244, 244, 0.6);
  }
</style>