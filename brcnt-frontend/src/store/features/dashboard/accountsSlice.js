import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    linkedAccounts: [],

}


const accountsSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {
        reset: () => initialState,
        addLinkedAccounts(state, action) {
            state.linkedAccounts = action.payload.accounts;
        }
    }
})

export const { reset, addLinkedAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;