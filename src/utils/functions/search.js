export const getFindItemsAudio = (arr, searchTerm) => {
    let findArray = [];
    arr.forEach(item => {
        if(item.name.toLowerCase().includes(searchTerm.toLowerCase())){
            if(findArray.length < 10){
                findArray.push(item);
            }
        }
    });
    return findArray;
};

export const getFindItemsAlbumAndAuthor = (arr, searchTerm) => {
    let findArray = [];
    arr.forEach(item => {
        if(item.title.toLowerCase().includes(searchTerm.toLowerCase())){
            if(findArray.length < 4){
                findArray.push(item);
            }
        }
    });
    return findArray;
};