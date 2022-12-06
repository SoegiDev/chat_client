<template>
      <div class="col-md-8 col-xl-6 chat">
        <div class="card">
          <div class="card-header msg_head">
            <div class="d-flex bd-highlight">
              <div class="img_cont">
                 <img v-if="currentChat.type==='channel'" :src="`${currentChat.avatarImage}`" class="rounded-circle user_img_channel">
                  <img v-else :src="`${currentChat.avatarImage}`" class="rounded-circle user_img">
                  <template v-if="currentChat.type==='person'">
                     <span v-if="currentChat.connected" class="online_icon"/>
                    <span v-else class="online_icon offline"/>
                  </template>              
              </div>
              <div class="user_info">
                <span>{{currentChat.username}}</span><br>
                <p v-if="typing.from_typing === currentChat._id && typing.to_typing === current_user._id && typing.isTyping"><small class="text-white">is Typing ...</small></p>
              </div>
            </div>
             <span id="action_menu_btn"><i class="fas fa-ellipsis-v"></i></span>
            <div class="action_menu" v-if="currentChat.type==='channel'">
              <ul>
                <li title="Liat Member" @click="showModalListMember"><i class="fas fa-user-circle"></i> View Member</li>
                <!-- <li><i class="fas fa-users"></i> Add to close friends</li> -->
                <li title="Tambah Member"  @click="showModalAdd"><i class="fas fa-plus"></i> Add to Channel</li>
                <!-- <li><i class="fas fa-ban"></i> Block</li> -->
              </ul>
            </div>
          </div>
          <div id="box" class="card-body msg_card_body">
            <div v-if="messages.loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div  v-for="(u, key) in messages.getMessages" :key="key">
                <div class="d-flex justify-content-start mb-4"  v-if="!u.fromSelf">
                  <div class="img_cont_msg">
                    <img :src="`${u.senderPicture}`" class="rounded-circle user_img_msg">
                  </div>
                  <div class="msg_cotainer" style='white-space:pre'>
                       <div class="img_cont_msg view_image_chat" v-if="u.attach" @click="showModal(u.attach)">
                        <img :src="`${u.attach}`" class="rounded-circle user_img_msg">
                      </div>
                      <div v-html="u.message"></div>
   <span v-if="currentChat.type ==='person'" class="msg_time_send">{{u.createdAt}}</span>
                      <span v-if="currentChat.type ==='channel'" class="msg_time_send">{{u.createdAt}} {{u.senderName}}</span>
                  </div>
                </div>
                <div class="d-flex justify-content-end mb-4" v-else>
                  <div class="msg_cotainer_send" style='white-space:pre'>
                      <div class="img_cont_msg view_image_chat" v-if="u.attach" @click="showModal(u.attach)">
                        <img :src="`${u.attach}`" class="rounded-circle user_img_msg">
                      </div>
                       <div v-html="u.message"></div>
                      <span v-if="currentChat.type ==='person'" class="msg_time_send">{{u.createdAt}} {{u.read === true ?'Dibaca':'Belum dibaca'}}</span>
                      <span v-if="currentChat.type ==='channel'" class="msg_time_send">{{u.createdAt}} {{u.senderName}}</span>
                  </div>
                  <div class="img_cont_msg">
                    <img :src="`${currentUser.avatarImage}`" class="rounded-circle user_img_msg">
                  </div>
                </div>
            </div>
          </div>
          <chat-input
          :currentChat="currentChat"
          :currentUser="currentUser"
          @handleSendMsg="handleSendMsg"
          />
          <ModalChannelTambahAnggota
          v-show="isVisibleAddAnggota"
          @closeModalAdd="closeModalAdd"
          :current_user="current_user"
          :currentChat="currentChat"
        />
        <ModalListMember
         v-show="isVisibleListMember"
          @closeModalListMember="closeModalListMember"
          :current_user="current_user"
          :currentChat="currentChat"
        />
        </div>
      </div>
       <transition name="modal">  
        <div v-if="isVisibleModal">
          <div class="overlay" @click.self="isVisibleModal = false;">
            <div class="modal_image">
              <div class="modal-body">
                <img :src='selectedImage ' style="max-height:500px; width:100%;"/>
              </div>
            </div>
          </div>
        </div>
    </transition>
</template>
<script>
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import axios from 'axios';
import {recieveMessageRoute,getChannelMessage,updateReadMessage,uploadImageAWS,sendMessageRoute,sendMessageChannelRoute} from '../utils/APIRoutes';
import {reactive,nextTick, onBeforeMount, watch, toRef , ref,defineComponent, onMounted} from 'vue'
import ChatInput from '../components/ChatInput.vue'
import socket from "../socket";
import $ from 'jquery'; 
import { inject } from 'vue';
import ModalChannelTambahAnggota from '../modal/add_anggota_channel.vue';
import ModalListMember from '../modal/all_member_Channel.vue'
export default defineComponent({
  name:"myChatContainer",
  props: {
    current_chat: JSON,
    current_user:JSON,
    contact_list:JSON,
    typing:Object

  },
   components:{
    ChatInput,
    ModalChannelTambahAnggota,
    ModalListMember
   },
  setup(props){
    const sweet_dialog = inject('$swal')
    const Typing = toRef(props, 'typing')
    const cryptojs = inject('cryptojs')
    const secretKey = process.env.VUE_APP_SECRET_KEY
    const currentChat = toRef(props, 'current_chat')
    const currentUser = toRef(props, 'current_user')
    const contactlist = toRef(props, 'contact_list')
    let selectedImage = ref(null)
    let messageIdReturn = ref(null)
    let isVisibleModal = ref(false)
    let isVisibleAddAnggota = ref(false)
    let isVisibleListMember = ref(false)
    let dataUpload = reactive({
      filename : null
    })
    let messages = reactive({
            loading:false,
            getMessages :[]
        });
    onBeforeMount(async() => {
      console.log("Before Mounted ChatContainer")
     })
    watch(currentChat, async(newValue, oldValue) => {
        messages.getMessages = null
        getRecordsMessages_update(newValue)
        console.log("old props",oldValue)
      // Both props are undefined so its just a bare callback func to be run
    });
    onMounted(async()=>{
      getRecordsMessages(currentChat)
      $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
      });
       
    })
    socket.on("msg-recieved", (msg) => {
      const decrypted = cryptojs.AES.decrypt(msg.message, secretKey);
      const str = decrypted.toString(cryptojs.enc.Utf8);
        messages.getMessages.push({
          from: msg.from,
          to: msg.to,
          fromSelf: false,
          message: str,
          attach:msg.image,
          createdAt:msg.createdAt,
          read:true,
          senderName:msg.senderName,
          senderPicture:msg.senderPicture
        })
        scrollToBottom()
        PostupdateReadMessage(msg.id)
    })

    function showModal(imgeName){
      selectedImage.value = imgeName
      isVisibleModal.value = true
    }
    const getChatTime = (dateChat) =>{
       let date = new Date(dateChat)
        let m = date.getMonth();
        let fm;                     // all this is to convert number to month name
        if (m===0){fm="January";}
        else if (m===1){fm="Feb";}
        else if (m===2){fm="March";}
        else if (m===3){fm="April";}
        else if (m===4){fm="May";}
        else if (m===5){fm="Jun";}
        else if (m===6){fm="July";}
        else if (m===7){fm="August";}
        else if (m===8){fm="Sept";}
        else if (m===9){fm="Oct";}
        else if (m===10){fm="Nov";}
        else if (m===11){fm="Dec";}
        else {fm="Error01"}
        var dateTgl = date.getDate();
        var time =  (date.getHours()<10?'0':'') + date.getHours()  + ":" +  (date.getMinutes()<10?'0':'') + date.getMinutes() ;
        return dateTgl+" "+fm+" "+time
    }
    const getRecordsMessages = async (userProps) => {
      console.log("PROPS",userProps._id)
      messages.loading=true
      let resData = null
      if(currentChat.value.type ==='channel'){
        resData = await axios.post(getChannelMessage, {
        from: currentUser.value._id,
        to: userProps.value._id,
        });        
      }else{
        resData = await axios.post(recieveMessageRoute, {
        from: currentUser.value._id,
        to: userProps.value._id,
        });
      }

      messages.getMessages = resData.data
      for (let i = 0; i < messages.getMessages .length; i++) {
        const pesan = messages.getMessages[i];
        const decrypted = cryptojs.AES.decrypt(pesan.message, secretKey);
        const str = decrypted.toString(cryptojs.enc.Utf8);
        pesan.message = str
        pesan.read = true
        pesan.createdAt = getChatTime(pesan.createdAt)
        PostupdateReadMessage(pesan.id)
      }
      // localStorage.setItem("chat_messages",JSON.stringify(resData.data));
        socket.emit("read message", {
       from: currentUser.value._id,
        to: currentChat.value._id,
        messageId: null
      });
      messages.loading=false
      scrollToBottom()
    }
    function PostupdateReadMessage(messageId){
       axios.post(updateReadMessage+'/'+messageId, {});
       socket.emit("read message", {
       from: currentUser.value._id,
        to: currentChat.value._id,
        messageId: messageId
      });
    }
    socket.on('read-sender', (data) => {
      console.log("sender",data)
      for (let i = 0; i <  messages.getMessages.length; i++) {
            const pesan =  messages.getMessages[i];
            pesan.read = true
          }
      messages.loading=false
      scrollToBottom()
    })
    
    const getRecordsMessages_update = async (userProps) => {
      console.log("UPDATE PROPS",userProps._id)
      messages.loading=true
      let resData = null
      if(currentChat.value.type ==='channel'){
        resData = await axios.post(getChannelMessage, {
        from: currentUser.value._id,
        to: userProps._id,
        });        
      }else{
        resData = await axios.post(recieveMessageRoute, {
        from: currentUser.value._id,
        to: userProps._id,
        });
      }
      messages.getMessages = resData.data
      for (let i = 0; i < messages.getMessages .length; i++) {
        const pesan = messages.getMessages[i];
        const decrypted = cryptojs.AES.decrypt(pesan.message, secretKey);
        const str = decrypted.toString(cryptojs.enc.Utf8);
        pesan.message = str
        pesan.read = true
        pesan.createdAt = getChatTime(pesan.createdAt)
        PostupdateReadMessage(pesan.id)
      }
       socket.emit("read message", {
       from: currentUser.value._id,
        to: currentChat.value._id,
        messageId: null
      });
      // localStorage.setItem("chat_messages",JSON.stringify(resData.data));
      messages.loading=false

      scrollToBottom()
    }
    function scrollToBottom() {
      nextTick(function () {
        let BoxEl = document.querySelector('#box');
        if(BoxEl)
            BoxEl.scrollTop = BoxEl.scrollHeight;
      });
    }
    
    const handleSendMsg = ({message,image,file_type,file_size,image_ori,file_name,date,senderName,senderPicture,toType}) => {
      let formData = new FormData()
      console.log(file_name)
      formData.append('image', image_ori)
      if(image !== null){
        try {
        axios.post(uploadImageAWS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) 
        {
           if (response.status === 200) {
            dataUpload.filename = response.data.data.Location
            console.log("Berhasil Gambar",dataUpload.filename)
            sendMessageChat({message,file_type,file_size,date,filename:dataUpload.filename,senderName,senderPicture,toType})
          } else {
            dataUpload.filename = response
            sweet_dialog(JSON.stringify(response.status));
          }
          })
        .catch(function (error) 
        {
          console.log(error)
           sweet_dialog(JSON.stringify(error));
          });
        } catch(error) {
          console.log(error)
           sweet_dialog(JSON.stringify(error));
          }
      }else{
        sendMessageChat({message,file_type,file_size,date,filename:null,senderName,senderPicture,toType})
      }
      
    }

    const sendMessageChat= async({message,file_type,file_size,date,filename,senderName,senderPicture,toType})=>{
      console.log("Chat Time",date)
      let dateTime = getChatTime(date)
      let info = null
      if(currentChat.value.type ==='channel'){
        info = await axios.post(sendMessageChannelRoute, {
          from: currentUser.value._id,
          to: currentChat.value._id,
          message: message,
          attach:filename,
          attach_type:file_type,
          attach_size:file_size
        });
      }else{
        info = await axios.post(sendMessageRoute, {
          from: currentUser.value._id,
          to: currentChat.value._id,
          message: message,
          attach:filename,
          attach_type:file_type,
          attach_size:file_size
        });
      }
       
        socket.emit("send-msg", {
          id:info.data.data._id,
          from: currentUser.value._id,
          to: currentChat.value._id,
          message: message,
          image:filename,
          createdAt:dateTime,
          senderName:senderName,
          senderPicture:senderPicture,
          toType:toType
        });
        const decrypted = cryptojs.AES.decrypt(message, secretKey);
        const str = decrypted.toString(cryptojs.enc.Utf8);
        messages.getMessages.push({
          fromSelf: true,
          message: str,
          attach:filename,
          createdAt:dateTime,
          senderName:senderName
        })
        scrollToBottom()

    }
    function showModalAdd() {
      isVisibleAddAnggota.value = true;
    }
    function closeModalAdd() {
      isVisibleAddAnggota.value = false;
      socket.emit("new friend channel",true)
    }
    function showModalListMember(){
      isVisibleListMember.value=true;
    }
    function closeModalListMember(){
      isVisibleListMember.value = false;
    }
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
    return{
        getRecordsMessages,
        messages,
        scrollToBottom,
        handleSendMsg,
        Typing,
        currentChat,
        currentUser,
        secretKey,
        cryptojs,
        showModal,
        selectedImage,
        isVisibleModal,
        isVisibleAddAnggota,
        PostupdateReadMessage,
        messageIdReturn,
        sendMessageChat,
        dataUpload,
        contactlist,
        showModalAdd,
        closeModalAdd,
        showModalListMember,
        closeModalListMember,
        isVisibleListMember
      }
}
})
</script>
<style>
 @import '../assets/App.css';
 
</style>
<style scoped>
.modal_image {
  width: auto;
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}
button {
  padding: 7px;
  margin-top: 10px;
  background-color: green;
  color: white;
  font-size: 1.1rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}
</style>