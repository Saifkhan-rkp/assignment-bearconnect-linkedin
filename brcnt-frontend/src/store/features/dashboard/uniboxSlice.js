import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    chats:[],
    page:0,
    paginations:{},
    errors:[],
    filters:{
        account:[]
    },
    conversation:{
        urn:"",
        accessId:"",
        convRef:"",
        chattingWith:{},
        chattingFrom:{},
        messages:[],
        unreadMessageCount:0,
    },
    unread:[]
};

const uniboxSlice = createSlice({
    name: "unibox",
    initialState,
    reducers: {
        reset: ()=> initialState,
        resetFilters(state){
            state.filters=initialState.filters
        },
        resetConversation(state){ 
            state.singleChat=initialState.singleChat
        },
        setFilter(state, action){
            if(action.type === "FILTER/ACCOUNT"){
                state.filters.account.push(action.payload.account); 
            }else{
                state.filters = {
                    ...state.filters,
                    ...action.payload
                }
            }
        },
        setPaginations(state, action){
            state.paginations = action.payload;
        },
        setChats(state, action){
            state.chats = action.payload;
        },
        setErrors(state, action){
            state.errors = action.payload;
        },
        setConversationMessages(state, action){
            state.conversation.messages = action.payload?.messages;
        },
        setConversationDetail(state, action){
            console.log(action.payload);
            state.conversation.urn = action.payload?.urn
            state.conversation.accessId = action.payload?.accessId
            state.conversation.chattingWith = action.payload?.chattingWith
            state.conversation.chattingFrom = action.payload?.chattingFrom
        },
        updateMessageList(state, action){
            state.conversation.messages = [
                ...state.conversation.messages,
                {
                    attachments: [],
                    body:action.payload.message,
                    createdAt:action.payload.createdAt,
                    messageId: state.conversation.urn,
                    messageType: 0,
                    postLink: null,
                    reactions: [],
                    senderMemberId: ""+state.conversation.chattingFrom?.accountId,
                    "subject": "MEMBER_TO_MEMBER"
                }
            ]
        },
    }
})

export const { 
    reset, 
    resetFilters, 
    resetConversation, 
    setFilter, 
    setChats,
    setConversationMessages,
    setConversationDetail,
    setPaginations,
    setErrors,
    updateMessageList,
} = uniboxSlice.actions;

export default uniboxSlice.reducer;