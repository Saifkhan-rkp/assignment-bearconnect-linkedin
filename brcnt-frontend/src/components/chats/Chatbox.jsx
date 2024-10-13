import React, { useState } from 'react'
import MessageList from './MessageList'
import { useSelector } from 'react-redux'
import useFetchAppData from '../../hooks/useFetchAppData';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import LoaderMini from '../loaders/LoaderMini';
import { useRef } from 'react';

function Chatbox({ }) {
    const { getConversation, isLoading, sendMessage, sendingMsg } = useFetchAppData()
    // const [error, setError] = useState(false);
    const inputRef = useRef()
    const { messages, chattingFrom, chattingWith, urn, accessId } = useSelector(state => state.unibox?.conversation);
    useEffect(() => {
        getConversation((err) => toast.error(err));
    }, [urn, accessId]);
    const onSend = () => {
        const message = inputRef?.current?.value;
        console.log(message);
        if (message && message !== "") {
            inputRef.current.value = "";
            sendMessage({ message, }, (err, message) => { 
                toast.error(err)
                inputRef.current.value = message;
            })
        }
    }

    return (
        <>
            <div className="h-full flex flex-col">
                <div className="bg-white border-slate-800 border-b p-4 text-gray-600 flex justify-between items-center">
                    <div className="flex items-center mb-4">
                        <img src={chattingWith?.imageUrl} alt="Profile" className="rounded-full mr-2 w-11 h-11" />
                        <div>
                            <p className="font-bold">{chattingWith?.fullName}</p>
                            <p className="text-gray-500">Talking from {chattingFrom?.fullName}</p>
                        </div>
                    </div>
                    <div className="relative inline-block text-left">
                        <button id="refetch" onClick={()=> getConversation((err) => toast.error(err))} className="hover:bg-gray-200 rounded-md p-1">
                            <i className='fas fa-light fa-arrows-rotate fa-lg '></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* <Suspense fallback={<LoaderMini/>}> */}
                    {isLoading
                        ?
                        <LoaderMini />
                        :
                        <MessageList sendingMessage={{ message: inputRef.current?.value || "", sending: sendingMsg }} messages={messages} from={{ id: chattingFrom?.accountId, name: chattingFrom?.fullName }} chattingWith={{ id: chattingWith?.id, name: chattingWith?.fullName }} />
                    }
                    {/* </Suspense> */}
                </div>

                <div className="bg-white p-4 flex items-center" >
                    <input type="text" ref={inputRef} name='message' id='message' placeholder="Type your message..." className="flex-1 border rounded-full px-4 py-2 focus:outline-none" />
                    <button onClick={onSend} disabled={isLoading} className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none">
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </button>
                </div>

            </div>
        </>
    )
}

export default Chatbox