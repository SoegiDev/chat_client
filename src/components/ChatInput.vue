<template>
    <div class="card-footer">
        <EmojiPicker :native="true" @select="onSelectEmoji" v-show="showEmojiPicker" />
        <form  @submit.prevent>
            <div class="input-group">
                <template v-if="preview">
                    <div class="input-group">
                        <img :src="preview" class="img-fluid" style="height:100px;width:100px"/>
                        <div class="input-group">
                        <p class="mb-0 text-white">file name: {{ image.name }}</p>
                        <p class="mb-0 text-white">size: {{ image.size/1024 }}KB</p>
                    </div>
                    <div class="input-group">
                        <p class="mb-0 text-white view_image_chat btn btn-info" @click="CancelImageUpload">Cancel</p>
                    </div>
                        
                    </div>
                </template>
                <div class="input-group-append"></div>
                    <span class="input-group-text emoticon_btn" @click="handleEmojiPickerhideShow">
                        <i class="fas fa-grin"></i>
                    </span>
                    <div class="input-group-text attach_btn">
                        <label class="click_image" for="my-file">
                          <i class="fas fa-paperclip"></i>
                        </label>
                        <input type="file" accept="image/*" @change="previewImage" class="form-control-file" id="my-file">
                    </div>
                    <textarea  name="" class="form-control type_msg" placeholder="Type your message..."
                    v-model="msg"/>
                <div class="input-group-append"></div>
                <span class="input-group-text send_btn" @click="sendChat"><i class="fas fa-location-arrow"></i></span>
            </div>  
        </form>
    </div>
</template>
<script>
import {toRef,ref, watch} from 'vue'
import socket from '../socket'
import EmojiPicker from 'vue3-emoji-picker'

// import css
import 'vue3-emoji-picker/css'
import { inject } from 'vue'
export default{
  components: {EmojiPicker},
    name:"MyInput",
    props: {
     currentChat:JSON,
     currentUser:JSON
   },
    setup(props,{ emit }){
        const sweet_dialog = inject('$swal')
        let msg = ref('')
        let showEmojiPicker = ref(false)
        let dateChat = ref(null)
        let preview =  ref(null)
        let image = ref(null)
        let imageBase64 = ref(null)
        let file_type = ref(null)
        let file_size = ref(null)
        let file_name = ref(null)
        let attachInput = ref(null)
        const cryptojs = inject('cryptojs')
        const secretKey = process.env.VUE_APP_SECRET_KEY
        const current_chat = toRef(props, 'currentChat')
        const current_user = toRef(props, 'currentUser')
        
    function handleEmojiPickerhideShow(){
        showEmojiPicker.value = showEmojiPicker.value ? false:true;
    }
    function CancelImageUpload(){
        preview.value = false
        attachInput.value.target.value = null
    }
    function previewImage(event) {
      attachInput.value = event;
      var input = attachInput.value.target;
      if (input.files) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
          imageBase64 = reader.result;
        }
        // console.log("size",(input.files[0]['size'] / 1024).toFixed(2) + "KB")
        // console.log("type",input.files[0]['type'])
        // console.log("Images",imageBase64)
        image.value=input.files[0];
        file_type.value = input.files[0]['type']
        file_size.value = (input.files[0]['size'] / 1024).toFixed(2)
        file_name.value = input.files[0]['name']
        reader.readAsDataURL(input.files[0]);
      }
    }
    const sendChat = ()=>{
        console.log(image.value)
        let newTime =new Date(Date.now());
        
        if(msg.value.length>0 && image.value === null){
            const encryptedText = cryptojs.AES.encrypt(msg.value, secretKey).toString()
            emit('handleSendMsg',{message:encryptedText,image:null,file_type: file_type.value,file_size: file_size.value,image_ori:image.value,file_name:file_name.value,date:newTime,senderName:current_user.value.username,senderPicture:current_user.value.avatarImage,toType:current_chat.value.type});
            preview.value = false
            image.value=null
            msg.value=''
        }
        if(msg.value.length>0 && image.value !== null){
            if (file_size.value > 400) {
                sweet_dialog("Your size Image Upload Max 400kb");
            }else{
                const encryptedText = cryptojs.AES.encrypt(msg.value, secretKey).toString()
                emit('handleSendMsg',{message:encryptedText,image:imageBase64,file_type: file_type.value,file_size: file_size.value,image_ori:image.value,file_name:file_name.value,date:newTime,senderName:current_user.value.username,senderPicture:current_user.value.avatarImage,toType:current_chat.value.type});
                preview.value = false
                msg.value=''
                image.value=null
                console.log("msg Ada")
            }
        }
        else if(msg.value.length==0 && image.value !== null){
            if (file_size.value > 400) {
                sweet_dialog("Your size Image Upload Max 400kb");
            }else{
                msg.value = 'image'
                const encryptedText = cryptojs.AES.encrypt(msg.value, secretKey).toString()
                emit('handleSendMsg',{message:encryptedText,image:imageBase64,file_type: file_type.value,file_size: file_size.value,image_ori:image.value,file_name:file_name.value,date:newTime,senderName:current_user.value.username,senderPicture:current_user.value.avatarImage,toType:current_chat.value.type});
                preview.value = false
                msg.value=''
                image.value=null
                console.log("msg tidak ada")
            }   
        }        
    }
    watch(msg, (m) => {
      m ? socket.emit('isTyping',{from:current_user.value._id,to:current_chat.value._id,status:true}) : socket.emit('stopTyping',{from:current_user.value._id,to:current_chat.value._id,status:false})
    })

    function onSelectEmoji(emoji) {
        msg.value += emoji.i
         showEmojiPicker.value = showEmojiPicker.value ? false:true;
        }
    return{
        onSelectEmoji,
        handleEmojiPickerhideShow,
        showEmojiPicker,
        sendChat,
        msg,
        current_chat,
        current_user,
        secretKey,
        cryptojs,
        preview,
        image,
        previewImage,
        imageBase64,
        file_type,
        file_size,
        CancelImageUpload,
        attachInput,
        dateChat
    }
    }
}

</script>
