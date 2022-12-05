<script>
  import {reactive,ref,toRef} from 'vue'
  import axios from 'axios';
  import {addChannel} from '../utils/APIRoutes';
  export default {
    components: {},
    props: {
     current_user:JSON
   },
    name:"myModalAddChannel",
    setup(props,{emit}){
      let showLoading = ref(false)
      let success_input = ref(false)
      let message_response = ref('')
      const my_account = toRef(props, 'current_user')
      let form_input = reactive({
            name: "",
        });
      function closeModalChannel(){
         emit('closeModalChannel');
         showLoading.value = false
         success_input.value = false
      }
      function submitAddChannels(){
        showLoading.value = true
          axios.post(addChannel+'/'+my_account.value._id, {
              name: form_input.name,
              })
              .then(response => {
                console.log(response.data.msg)
                success_input.value = true
                showLoading.value = false
                message_response.value = response.data.msg
                form_input.name = ''
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
        closeModalChannel,
        form_input,
        submitAddChannels,
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
          <h4 class="modal-title">Tambah Channel</h4>
          <button type="button" class="btn btn-sm" @click="closeModalChannel">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label class="control-label">Nama Channel</label>
                <div>
                  <input type="text" class="form-control input-md" v-model="form_input.name">
                </div>
            </div>
          </form>
          <div v-if="showLoading" class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
           <label v-if="success_input" class="control-label">{{message_response}}</label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModalChannel">Close</button>
          <button type="button" class="btn btn-primary" @click="submitAddChannels">Tambah</button>
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
