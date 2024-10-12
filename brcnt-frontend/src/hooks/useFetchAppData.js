import axios from 'axios';
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getAuthData } from '../utils/utils';
import * as linkedAccounts from "../store/features/dashboard/accountsSlice";
import * as unibox from "../store/features/dashboard/uniboxSlice"
import { useState } from 'react';
import { useSelector } from 'react-redux';
function useFetchAppData() {
    const [isLoading, setLoading] = useState(false);
    const [sendingMsg, setSendingMsg] = useState(false);
    const dispatch = useDispatch();
    const auth = getAuthData();
    const serverUrl = import.meta.env.VITE_API_URL;
    const { urn, accessId } = useSelector(state => state?.unibox?.conversation);

    const authApi = axios.create({
        baseURL: `${serverUrl}/api`,
        headers: {
            Authorization: `Bearer ${auth?.accessToken}`
        }
    })

    const callback = (uri, provider, setError = () => { }) => {
        setLoading(true)
        authApi.get(`/${uri}`).then(res => {
            if (res.data?.success) {
                provider(res.data?.data)
            }
            setLoading(false)
        }).catch(err => {
            setError(err.response?.data?.message || err?.message || "Unable to fetch request.")
            setLoading(false)
        });
    }
    const getConnectedAccounts = useCallback((setError) => callback("account/connected-accounts",
        (data) => dispatch(linkedAccounts.addLinkedAccounts({ accounts: data[0]?.accounts })),
        setError),
        [callback, dispatch, linkedAccounts]
    );
    const getConversations = useCallback((setError) => callback("utils/getConversations",
        (data) => {
            dispatch(unibox.setChats(data?.convs || []))
            dispatch(unibox.setPaginations(data?.paging || {}))
        },
        setError),
        []
    );
    const getConversation = useCallback((setError) => callback(`utils/getConversation/${accessId}?conv=${urn}`,
        (data) => dispatch(unibox.setConversationMessages({ messages: data?.messages })),
        setError),
        [callback, dispatch, unibox, isLoading]
    );

    const sendMessage = useCallback((data = { message: "" }, setError) => {
        setSendingMsg(true)
        if (!data.message || data.message === "") {
            setError("message not to empty")
            return
        }
        authApi.post(`utils/${accessId}/sendMessage`, { message: data.message, messageId: urn })
            .then(res => {
                console.log(res.data);
                if (res.data?.status) {
                    dispatch(unibox.updateMessageList({message:data.message, createdAt: res.data?.value?.createdAt || Date.now()}))
                }
                setSendingMsg(false)
            }).catch(err => {
                setSendingMsg(false)
                setError(err?.response?.data?.message || err?.message)
            })
    }, [urn, accessId, sendingMsg, dispatch, unibox])
    return { getConnectedAccounts, getConversations, getConversation, sendMessage, authApi, unibox, isLoading, sendingMsg }
}

export default useFetchAppData