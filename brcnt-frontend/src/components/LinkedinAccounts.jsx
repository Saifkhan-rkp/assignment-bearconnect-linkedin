import React from 'react'
import AccountSiginModal from './model/AccountSiginModal'
import { useSelector } from 'react-redux'
import LoaderMini from './loaders/LoaderMini'
import useFetchAppData from '../hooks/useFetchAppData'
import { useOutletContext } from 'react-router-dom'

function LinkedinAccounts() {
    const isLoading = useOutletContext();
    const accounts = useSelector(state => state.accounts.linkedAccounts);
    return (
        <>
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">LinkedIn Accounts</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4">
                            <div className="relative">
                                <input type="text" placeholder="Search" className="border rounded-lg py-2 px-4 pl-10 w-64" />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                            <select className="border rounded-lg py-2 px-4">
                                <option>All accounts</option>
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">+ Purchase more seats</button>
                            <AccountSiginModal />
                        </div>
                    </div>
                    {isLoading
                        ? <LoaderMini />
                        :
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Name</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Connections</th>
                                    <th className="py-2">Followers</th>
                                    <th className="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(acc => (
                                    <tr className="border-b">
                                        <td className="py-2 flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600">S</span>
                                            </div>
                                            <span>{acc?.account?.username}</span>
                                        </td>
                                        <td className="py-2">
                                            {acc?.account?.isActive &&
                                                <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm">Available</span>
                                            }
                                            {acc?.account?.loginInProgress &&
                                                <span className="bg-orange-100 text-orange-600 py-1 px-3 rounded-full text-sm">Login in Progress</span>
                                            }
                                        </td>
                                        <td className="py-2">{acc?.account?.linkedInUserProfile?.connections}</td>
                                        <td className="py-2">{acc?.account?.linkedInUserProfile?.followers}</td>
                                        <td className="py-2">
                                            <i className="fas fa-light fa-ellipsis-vertical text-gray-400"></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    <div className="flex justify-between items-center mt-4">
                        <span>Showing 1 - 1 of 1</span>
                        <span className="text-blue-600">+ 2 seats available</span>
                        <div className="flex space-x-2">
                            <button className="border border-gray-300 py-1 px-3 rounded-lg">Previous</button>
                            <button className="border border-gray-300 py-1 px-3 rounded-lg">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LinkedinAccounts