export const convertData = (date) => {
    const now = new Date()
    const currentOffset = new Date().getTimezoneOffset() / 60
    const utcDate = new Date(date)
        
    utcDate.setHours(utcDate.getHours() - currentOffset)
    const localDate = utcDate.toLocaleString().split(", ")

    if ((Math.floor((now-utcDate)/3600000)-currentOffset) > 24){
        return localDate[0]
    }
    else
        return localDate[1]
}