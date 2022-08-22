import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, collection } from "firebase/firestore";
import {ref,getDownloadURL } from "firebase/storage";
import { ALBUMS, AUDIO, AUTHORS, GENRES, USERS } from "../data/collectionsId";
import { ALBUM_STORAGE, AUTHOR_STORAGE } from "../data/storageId";

//Doc and Docs (General Function)
export const getDocDbAndSetState = async (db, collection, id, setFunc) => {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(prev => [...prev, docSnap.data()]);
};

export const getDocDbAndSetStateWithoutPrev = async (db, collection, id, setFunc) => {
    const docRef = await doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data());
};

export const getDocDbAndReturn = async (db, collection, id) => {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    return await docSnap.data();
};

export const getAllDocument = async (db, storage, collect, setFunc) => {
    const querySnapshot = await getDocs(collection(db, collect));
    let arr = [];
    await querySnapshot.forEach((doc) => {
        if(collect === 'albums'){
            getImageStorage(storage, ALBUM_STORAGE , doc.data().id).then(resImg => {
                arr.push({...doc.data(), image: resImg});
            })
        } else if(collect === 'authors'){
            getImageStorage(storage, AUTHOR_STORAGE, doc.data().id).then(resImg => {
                arr.push({...doc.data(), image: resImg});
            })
        } 
        else {
            arr.push(doc.data());
        }
    });
    setFunc(arr);
    return arr;
};

// Album Db
export const addUserFavoriteAlbum = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAlbum: arrayUnion({albumId: uid})
    });
};

export const removeUserFavoriteAlbum = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAlbum: arrayRemove({albumId: uid})
    });
};

export const getFavoriteAlbum = async (db, id) => {
    const docRef = await doc(db, USERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data().favoriteAlbum;
};

//Audio db
export const addUserFavoriteAudio = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAudio: arrayUnion({audioId: uid})
    });
};

export const removeUserFavoriteAudio = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAudio: arrayRemove({audioId: uid})
    });
};

export const getFavoriteMusic = async (db, id) => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    return docSnap.data().favoriteAudio;
};


export const getAudioStorage = async (storage, collection, id, setFunc) => {
    const pathReference = await ref(storage, `${collection}/${id}`);
    await getDownloadURL(pathReference)
    .then((url) => {
        setFunc(url);
    })
    .catch(() => {

    })  
};

//Author

export const getAuthor = async (db, id) => {
    const docRef = await doc(db, AUTHORS, id);
    const docSnap = await getDoc(docRef);
    return await docSnap.data();
};

export const addUserFavoriteAuthor = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAuthor: arrayUnion({authorId: uid})
    });
};

export const removeUserFavoriteAuthor = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAuthor: arrayRemove({authorId: uid})
    });
};

export const getFavoriteAuthor = async (db, id) => {
    const docRef = doc(db, USERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data().favoriteAuthor;
};

//Id
export const getAuthorId = async (db, collection, id, setFunc) => {
    const docRef = await doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data().authorId);
    return docSnap.data().authorId;
};

export const getAlbumId = async (db, collection, id, setFunc) => {
    const docRef = await doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data().albumId);
    return docSnap.data().albumId;
};

export const getAuthorNameById = async (db, id, setFunc) => {
    const docRef = await doc(db, AUTHORS, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data().title);
};

export const getGenreNameById = async (db, id, setFunc) => {
    const docRef = await doc(db, GENRES, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data().genre);
};

export const getAudioByid = async (db, id, setFunc) => {
    const docRef = await doc(db, AUDIO, id);
    const docSnap = await getDoc(docRef);
    await setFunc(prev => [...prev,docSnap.data()]);
};

export const getAlbumsByid = async (db, storage, id, setFunc) => {
    const docRef = await doc(db, ALBUMS, String(id));
    const docSnap = await getDoc(docRef);
    await getImageStorage(storage, ALBUM_STORAGE, id).then((image) => {
        setFunc(prev => [...prev,{...docSnap.data(), image}]);
    });
};

//storage
export const getImageStorage = async (storage, collection, id) => {
    const pathReference = ref(storage, `${collection}/${id}`);
    let urlExport = '';
    await getDownloadURL(pathReference)
    .then((url) => {
        urlExport = url;
    })
    .catch((error) => {
    })
    return urlExport;
};

export const downloadFile = async (pathReference, setFunc) => {
    getDownloadURL(pathReference)
    .then((url) => {
        setFunc(url);
    })
    .catch(() => {

    })
};