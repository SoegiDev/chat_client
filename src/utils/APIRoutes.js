export const VUE_URL = process.env.VUE_APP_URL
export const VUE_KEY_STORAGE = process.env.VUE_APP_KEY_STORAGE
export const VUE_SECRET = process.env.VUE_APP_SECRET_KEY

export const host = `${VUE_URL}`;
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const updateUserConnectdisConnected = `${host}/api/auth/update_connect`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const allFriendsRoute = `${host}/api/auth/allfriends`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const sendMessageChannelRoute = `${host}/api/messages/addmsgchannel`;
export const countMessageFriends = `${host}/api/messages/count_msg`;
export const countMessageChannels = `${host}/api/message/count_msg_channel`;
export const updateReadMessage = `${host}/api/messages/updateReadMessage`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const addNewFriend = `${host}/api/auth/add_friend`;
export const uploadImageAWS = `${host}/api/messages/uploadimageaws`;

export const friendsMandatory = `${host}/api/auth/friendsmandatory`;

// CHANNEL//
export const getChannelMessage = `${host}/api/messages/getmsgchannel`;
export const addChannel = `${host}/api/channels/addchannel`;
export const addMemmberChannel = `${host}/api/channels/addmember`;
export const channelAllMember = `${host}/api/channels/allmember`;
export const getAllChannels = `${host}/api/channels/getallchannels`;


