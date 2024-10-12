
export const getAuthData = () => {
    return JSON.parse(localStorage.getItem("auth")) || null;
};


export const LogoutUser = () => {
    window.localStorage.removeItem("auth");
    window.location.reload();
}

export const getTimeDifference = (timestamp) => {
    const now = Date.now();  // Get current time in milliseconds
    const diffInMs = now - timestamp; // Difference in milliseconds

    const msInSeconds = 1000;
    const msInMinutes = msInSeconds * 60;
    const msInHours = msInMinutes * 60;
    const msInDays = msInHours * 24;
    const msInWeeks = msInDays * 7;
    const msInMonths = msInDays * 30;  // Approximate
    const msInYears = msInDays * 365;  // Approximate

    if (diffInMs < msInMinutes) {
        return `${Math.floor(diffInMs / msInSeconds)}s`;  // Seconds
    } else if (diffInMs < msInHours) {
        return `${Math.floor(diffInMs / msInMinutes)}m`;  // Minutes
    } else if (diffInMs < msInDays) {
        return `${Math.floor(diffInMs / msInHours)}h`;    // Hours
    } else if (diffInMs < msInWeeks) {
        return `${Math.floor(diffInMs / msInDays)}d`;     // Days
    } else if (diffInMs < msInMonths) {
        return `${Math.floor(diffInMs / msInWeeks)}w`;    // Weeks
    } else if (diffInMs < msInYears) {
        return `${Math.floor(diffInMs / msInMonths)}m`;   // Months
    } else {
        return `${Math.floor(diffInMs / msInYears)}y`;    // Years
    }
};


export const formatExactDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const min = date.getMinutes();
    const hour = date.getHours();
    return { messageDate: date.toLocaleDateString('en-US', options), time: (hour<10 ? `0${hour}`: hour )+ ":" + (min<10 ? `0${min}` :min )};
};