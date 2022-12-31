<template>
 <div class="container-fluid h-50">
    <div class="row justify-content-center h-100">
      <contacts
      :current_user="current_user"
      :friend_list="friend_list"
      :typing="typing"
      @changeChat="handleChatChange"
      @sign_out="sign_out"
      @newFriend="newFriend"
      @newChannel="newChannel"
      />
      <welcome
       v-if="current_chat == undefined"
      :current_user="current_user"
      />
      <chat-container 
      v-else
      :current_chat="current_chat"
      :current_user="current_user"
      :contact_list="contact_list"
      :typing="typing"
      />

    </div>
  </div>

</template>
<script>
//Bootstrap

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import { ref,onBeforeMount,onMounted,reactive } from 'vue'
import { useRouter } from 'vue-router';
import Contacts from '../components/Contacts.vue';
import ChatContainer from '../components/ChatContainer.vue';
import Welcome from '../components/Welcome.vue';
import axios from 'axios';
import {get_user_device,logoutRoute,allFriendsRoute,getAllChannels,updateUserConnectdisConnected,allUsersRoute,countMessageFriends,friendsMandatory,countMessageChannels} from '../utils/APIRoutes';
import socket from "../socket";
export default {
  name:"myChat",
  components: {
    Contacts,
    ChatContainer,
    Welcome
  },
  setup(){
    const username = ref('');
    let selectedUser = ref('')
    const current_user = ref(JSON);
    const router = useRouter();
    let userGetDevice = reactive({})
    const profile=reactive({
      email:null,
      username:null,
      connected:false,
      logout:false,
      avatarImage:null,
      _id:null,

    })
    const contact_list = reactive({
            contacts: [],
            total_user:0
    })
    const friend_list = reactive({
            contacts: [],
            total_user:0
    })
    const channel_list = reactive({
            channels: [],
            total_channel:0
    })
    const typing =reactive({
      isTyping:false,
      from_typing:'',
      to_typing:''
    })
    const current_chat = ref(undefined);
    onBeforeMount(() => {
      const auth = JSON.parse(
          localStorage.getItem(process.env.VUE_APP_KEY_STORAGE))
          const username = auth.username
          const userID = auth._id
          const email = auth.email
          const avatarImage = auth.avatarImage
          socket.auth = { username,userID,email,avatarImage};
          socket.connect();
          getCurrentUser();
    });
    function sign_out () {
      console.log(current_user.value.devices[0]._id)
      updateStatus(current_user.value._id,false)
      exitFromChat(current_user.value._id,current_user.value.devices[0]._id,false)
      localStorage.clear()
      router.push({ name: 'login' })
      router.go()
    }
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
        socket.auth = { sessionID };
        socket.connect();
      }
    socket.on("joinChat", ({ sessionID, userID,email,avatarImage }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
        // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
        // save the ID of the user
      socket.userID = userID;
      socket.email = email;
      socket.avatarImage=avatarImage;
      updateStatus(userID,true)
    });
    onMounted(async() => {
      try {
          await getRecords();
          await getFriends();
          await getChannels();
          checkOnline()
          friend_list.contacts.sort(function(a,b){
            return new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)
          })
        } catch {
            console.log('error')
        }
      
    })
    const newFriend = async()=>{
      await getFriends();
      await getChannels();
      socket.emit('new friend')
      checkOnline()
      friend_list.contacts.sort(function(a,b){
        return new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)
      })
    }
    const userDevice = async () => {
            let res = null
            res = await axios.get(get_user_device+"/"+current_user.value._id);
            return res;
        };
    
    const newContact = async()=>{
      await getRecords();
      // socket.emit('new channel')
      checkOnline()
      friend_list.contacts.sort(function(a,b){
        return new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)
      })
    }
    const newChannel = async()=>{
      await getFriends();
      await getChannels();
      // socket.emit('new channel')
      checkOnline()
      friend_list.contacts.sort(function(a,b){
        return new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)
      })
    }
   
    const getCurrentUser = async() => {
      if (!localStorage.getItem(process.env.VUE_APP_KEY_STORAGE)) {
        router.push({name:'login'})
        router.go
        }else{
          current_user.value = JSON.parse(
          localStorage.getItem(process.env.VUE_APP_KEY_STORAGE)
          )
        }

      userGetDevice = await userDevice()
      if(current_user.value.devices[0].device.browser !== userGetDevice.data.device[0].device.browser){
        sign_out ()
       }
    }
    
    const getRecords = async() => {
      let resData = await axios.get(allUsersRoute+'/'+current_user.value._id);
      contact_list.contacts = resData.data
      for (let i = 0; i < contact_list.contacts.length; i++) {
          const user = contact_list.contacts[i];
          const counting= await fetchCountMessage(user._id,current_user.value._id,"person")
          user.countMessage = counting
        }
    }
    const getFriends = async() => {
      let resData = await axios.get(allFriendsRoute+'/'+current_user.value._id);
      if(resData.data){
              let resDataMandatory = await axios.get(friendsMandatory+'/'+current_user.value._id);
      friend_list.contacts = resData.data
      console.log("Friend",friend_list.contacts)
      for (let i = 0; i < friend_list.contacts.length; i++) {
          const user = friend_list.contacts[i];
            for (let j=0; j < resDataMandatory.data.length; j++) {
              const fr = resDataMandatory.data[i]
              user.chatUpdatedAt = fr.chatUpdatedAt
              user.type="person"
              const counting= await fetchCountMessage(user._id,current_user.value._id,"person")
              user.countMessage = counting
            }
          
          
        }
      }
    }

    const fetchCountMessage = async (from,to,types) => {
        let res = null
        if(types==='person'){
          res = await axios.get(countMessageFriends+'/'+from+'&'+to);
        }else{
          res = await axios.get(countMessageChannels+'/'+from+'&'+to);
        }
        return res.data;
    };
    const getChannels = async() => {
      let resData = await axios.get(getAllChannels);
      channel_list.channels = resData.data
      for (let i = 0; i < channel_list.channels.length; i++) {
          const checkUser = channel_list.channels[i].sockets.find(el => el._id === current_user.value._id);
          const channel = channel_list.channels[i]
          socket.emit('room',channel._id)
          if(checkUser){
           friend_list.contacts.push({
            _id: channel._id,
            username:channel.name,
            email:channel.name,
            type:"channel",
            hashNewsMessage:false,
            avatarImage:channel.avatarImage,
            chatUpdatedAt:null,
            connected:false,
            countMessage:0,
            logout:false});
          }
        }
    }
    
    function handleChatChange (chat) {
        current_chat.value = chat;
        selectedUser.value = chat;
        chat.hashNewsMessage = false;
        chat.countMessage=0
      }

    socket.on("msg-recieved", (msg) => {
      console.log("LIST MESSAGE",msg)
      const found = friend_list.contacts.some(el => el._id === msg.from);
      if(found){
        for (let i = 0; i < friend_list.contacts.length; i++) {
          const user = friend_list.contacts[i];
          if (user._id === msg.from && msg.toType!=='channel') {
            if (user._id !== selectedUser.value._id) {
              user.countMessage = user.countMessage+1
              user.hashNewsMessage = true;
              user.chatUpdatedAt = new Date(Date.now())
            }
            break;
          }
          if (user._id === msg.to && msg.toType==='channel') {
            console.log("Sama ID nya Channel",user._id,msg.to)
            if (user._id !== selectedUser.value._id) {
              user.countMessage = user.countMessage+1
              user.hashNewsMessage = true;
              user.chatUpdatedAt = new Date(Date.now())
            }
            break;
          }
        }
      }
      else{
        let check_contact = contact_list.contacts.find(el => el._id === msg.from);
          friend_list.contacts.push({
          _id: check_contact._id,
          username: "new _ "+check_contact.username,
          email:check_contact.email,
          hashNewsMessage:true,
          avatarImage:check_contact.avatarImage,
          chatUpdatedAt:msg.createdAt,
          countMessage: 1,
          pin:check_contact.pin,
          connected:true,
          logout:false});
      }
      friend_list.contacts.sort(function(a,b){
        return new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)
      })
    })
    socket.on('isTyping', (data) => {
      typing.isTyping = data.status
      typing.from_typing = data.from
      typing.to_typing = data.to
    })
    
    socket.on('stopTyping', (data) => {
      typing.isTyping = data.status
      typing.from_typing = data.from
      typing.to_typing = data.to
    })
    socket.on('new friend', (data) => {
      console.log("New Friend",data)
      newContact()
    })
    socket.on('new friend channel', (data) => {
      newChannel()
      console.log("New Friend Channel",data)
    })

    socket.on("info_join_user", ({userID,username,email,avatarImage }) => {
      const found = friend_list.contacts.some(el => el._id === userID);
      if (!found) {
        console.log(username,email,avatarImage,"Bukan Teman")
      }
      else{
        for (let i = 0; i < friend_list.contacts.length; i++) {
          const user = friend_list.contacts[i];
          if (user._id === userID) {
              user.connected = true;
              break;
          }
        }
        checkOnline()
      }
    });
    function checkOnline(){
      let total_online = 0
        for (let i = 0; i < friend_list.contacts.length; i++) {
          const user = friend_list.contacts[i];
              if(user.connected){
                total_online = total_online+1
              }
        }
      friend_list.total_user = total_online
    }
    socket.on("user_disconnected", (id) => {
      connect_disconnect(id,false)
    })

    const updateStatus = (id,status) => {
      try {
        axios.post(updateUserConnectdisConnected+'/'+id, {status_connect:status})
        .then(function (response) {console.log(response)})
        .catch(function (error) {console.log(error)});
        } catch(error) {
          console.log(error)
          }
    }
    const exitFromChat = (id,device,status) => {
      try {
        axios.post(logoutRoute+'/'+id+"/"+device, {status_connect:status})
        .then(function (response) {console.log(response)})
        .catch(function (error) {console.log(error)});
        } catch(error) {
          console.log(error)
          }
    }

    function connect_disconnect(id,status){
      for (let i = 0; i < friend_list.contacts.length; i++) {
          const user = friend_list.contacts[i];
          if (user._id === id) {
              user.connected = status;
              updateStatus(id,status)
              checkOnline()
            break;
          }
      }
    }

    socket.on("user count",(total)=>{
      console.log("User Online saat ini",total)
      checkOnline()
    })
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    return{
      connect_disconnect,
      username,
      sign_out,
      contact_list,
      friend_list,
      channel_list,
      current_user,
      current_chat,
      handleChatChange,
      typing,
      selectedUser,
      updateStatus,
      profile,
      newFriend,
      newChannel,
      newContact,
      checkOnline,
      exitFromChat,
      userDevice,
      userGetDevice
    }
  }
}
</script>
<style>
 @import '../assets/App.css';
</style>