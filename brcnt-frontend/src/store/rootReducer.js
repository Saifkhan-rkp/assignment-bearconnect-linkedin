
import uniboxReducer from "./features/dashboard/uniboxSlice"
import accountsReducer from "./features/dashboard/accountsSlice" 

const rootReducer = {
    unibox: uniboxReducer,
    accounts:accountsReducer
};

export default rootReducer;