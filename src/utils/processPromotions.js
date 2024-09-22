export const processPromotions = (promotionsIDs) => {
    console.log(promotionsIDs)
    if (promotionsIDs) {
        return JSON.parse(promotionsIDs)
    }else{
        return []
    }
}