<script>
  import {reactive,ref,toRef} from 'vue'
  import axios from 'axios';
  import {addNewFriend} from '../utils/APIRoutes';
  export default {
    components: {},
    props: {
     current_user:JSON
   },
    name:"myModalAddUser",
    setup(props,{emit}){
      let showLoading = ref(false)
      let success_input = ref(false)
      let message_response = ref('')
      const my_account = toRef(props, 'current_user')
      let form_input = reactive({
            username: "",
            type:"private"
        });
      function closeModal(){
         emit('close');
         showLoading.value = false
         success_input.value = false
      }
      function submitAddFriends(){
        showLoading.value = true
          axios.post(addNewFriend+'/'+my_account.value._id, {
              username: form_input.username,
              type: form_input.type
              })
              .then(response => {
                console.log(response.data.msg)
                success_input.value = true
                showLoading.value = false
                message_response.value = response.data.msg
                form_input.username = ''
              })
              .catch(error => {
                console.log(error)
                showLoading.value = false
                success_input.value = true
                message_response.value = "Input data Gagal"
              })
              .finally(() => showLoading.value = false)
          }

      return{
        closeModal,
        form_input,
        submitAddFriends,
        showLoading,
        success_input,
        message_response,
        my_account
      }
    }
  }
</script>

<template>
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Tambah Teman</h4>
          <button type="button" class="btn btn-sm" @click="closeModal">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label class="control-label">Masukkan username atau Pin Teman</label>
                <div>
                  <input type="text" class="form-control input-md" v-model="form_input.username">
                </div>
            </div>
          </form>
          <div v-if="showLoading" class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
           <label v-if="success_input" class="control-label">{{message_response}}</label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="submitAddFriends">Tambah</button>
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
