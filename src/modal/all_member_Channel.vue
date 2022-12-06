<script>
  import {reactive,toRef,onMounted} from 'vue'
  import axios from 'axios';
  import {channelAllMember} from '../utils/APIRoutes';
  export default {
    components: {},
    props: {
     current_user:JSON,
     currentChat:JSON
   },
    name:"myModalAllMember",
    setup(props,{emit}){
      const my_account = toRef(props, 'current_user')
      const current_chat = toRef(props, 'currentChat')
      let member_list = reactive({
            _id: null,
            name:null,
            socket: []
        });
      function closeModalListMember(){
         emit('closeModalListMember');
      }
      onMounted(async() => {
        await getAllMember();
      });
      const getAllMember = async() => {
        let resData = await axios.get(channelAllMember+'/'+current_chat.value._id);
        console.log(current_chat.value._id)
        console.log("All Member",resData.data)
        member_list._id = resData.data._id
        member_list.name = resData.data.name
        member_list.socket = resData.data.sockets
      }
      return{
        closeModalListMember,
        my_account,
        getAllMember,
        member_list
      }
    }
  }
</script>

<template>
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">List Member</h4>
          <button type="button" class="btn btn-sm" @click="closeModalListMember">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ol class="list-group list-group-numbered" v-for="(u, key) in member_list.socket" :key="key">
            <li class="list-group-item d-flex justify-content-between">
              <div class="ms-2 me-auto">
                <div class="fw-bold">{{u.username}}</div>
              </div>
              <span class="badge bg-primary rounded-pill"  v-if="u.isAdmin===true">Admin</span>
            </li>
          </ol>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModalListMember">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  display: block;
  overflow: hidden;
  outline: 0;
  background-color: rgba(0, 0, 0, 0.6);
  }
</style>
