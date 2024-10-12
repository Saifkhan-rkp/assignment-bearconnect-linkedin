import React from 'react'
import Chatbox from './Chatbox'
import { useSelector } from 'react-redux'

function ConversationBox() {
    // const { getConversation } = useFetchAppData()
    const conversation = useSelector(state => state.unibox?.conversation || {})
    return (
        <div className='flex w-full'>
            {/* Chat panel */}
            <div className='w-2/3'>
                <Chatbox />
            </div>
            {/* Profile Panel */}
            <div className="flex flex-col w-1/3 border-l h-full">
                <div className='overflow-y-auto w-full px-3'>
                    <div className="flex flex-col items-center mt-8">
                        <img
                            src={
                                conversation?.chattingWith?.imageUrl
                            }
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover"

                        />
                        <div className='mt-4 font-bold text-xl text-gray-700 text-center'>
                            <span className="">{conversation?.chattingWith?.fullName}</span>
                            <span className="text-gray-500 m-2" >
                                <a href={conversation?.chattingWith?.profileUrl || "#"}>
                                    <i className="fas fa-light fa-arrow-up-right-from-square" />
                                </a>
                            </span>
                        </div>
                        <div className="flex items-center my-4">
                            <button className="text-gray-500"><i className="fas fa-envelope fa-xl"></i></button>
                            <button className="text-gray-500 ml-4"><i className="fas fa-paper-plane fa-xl"></i></button>
                            <button className="text-gray-500 ml-4"><i className="fas fa-trash fa-xl"></i></button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className='border-2 rounded-lg p-4 border-secondary-muted w-full relative ng-star-inserted'>
                            <p className="font-bold">Tags</p>
                            <button className="bg-green-100 text-green-700 px-2 py-1 rounded">campaigns tag</button>
                            <button className="text-gray-500 ml-4">Edit</button>
                        </div>
                    </div>
                    <div>
                        <div className='border-2 rounded-lg p-4 border-secondary-muted w-full relative text-nowarp'>
                            <p className="font-bold">Headline</p>
                            <p className=' text-wrap'>{conversation?.chattingWith?.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationBox