import React from 'react'
import { formatExactDate } from '../../utils/utils';

function MessageList({ sendingMessage, messages = [], from = {}, chattingWith = {} }) {
    let lastPrintedDate = null;
    // const [optMessages, optfn] = useOp
    console.log(messages)
    return (
        <div className="flex flex-col space-y-2">
            {messages.map((message, idx) => {
                const { messageDate, time } = formatExactDate(message.createdAt);
                const showDate = messageDate !== lastPrintedDate;
                lastPrintedDate = messageDate;
                const senderIsMe = message?.senderMemberId?.includes(from?.id)
                return (
                    <div key={idx}>
                        {
                            showDate &&
                            <div className="flex items-center justify-center my-3 -mx-5">
                                <div className="flex-auto border-b-2 border-orange-100"></div>
                                <div className="flex-0 mx-3 text-sm font-medium leading-5 text-secondary">{messageDate}</div>
                                <div className="flex-auto border-b-2 border-orange-100"></div>
                            </div>
                        }
                        <div className={`flex ${senderIsMe ? "justify-end" : ""} w-full`}>
                            <div className={`rounded-lg text-dark ${senderIsMe ? "bg-blue-200" : "bg-gray-300"} px-8 py-6 max-w-xs`}>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-dark mr-4"> {senderIsMe ? from?.name : chattingWith?.name}</div>
                                    <div className="text-xs text-secondary">{time}</div>
                                </div>
                                <div className="min-w-4 leading-5 text-dark text-left w-full break-word mt-4 " style={{ "whiteSpace": "break-spaces", "wordBreak": "break-word" }}>
                                    {message?.body}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
            {sendingMessage?.sending &&
                <div>
                    <div className={`flex justify-end } w-full`}>
                        <div className={`rounded-lg text-dark bg-blue-200 px-8 py-6 max-w-xs`}>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-dark mr-4"> {from?.name}</div>
                                <div className="text-xs text-secondary">{formatExactDate(Date.now()).time}</div>
                            </div>
                            <div className="min-w-4 leading-5 text-dark text-left w-full break-word mt-4 " style={{ "whiteSpace": "break-spaces", "wordBreak": "break-word" }}>Hi Saif ,
                                {sendingMessage?.message}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <p className='px-8 py-6 animate-pulse text-gray-900'>sending...</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default MessageList