import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {ref,getDownloadURL } from "firebase/storage";
import { USERS } from "../data/collectionsId";

//Doc and Docs (General Function)
const getDocDbAndSetState = async (db, collection, id, setFunc) => {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(prev => [...prev, docSnap.data()]);
};

const getDocDbAndSetStateWithoutPrev = async (db, collection, id, setFunc) => {
    const docRef = await doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data());
};

const getDocDbAndReturn = async (db, collection, id) => {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    return await docSnap.data();
};

// Album Db
const addUserFavoriteAlbum = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAlbum: arrayUnion({albumId: uid})
    });
};

const removeUserFavoriteAlbum = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAlbum: arrayRemove({albumId: uid})
    });
};

const getFavoriteAlbum = async (db, id) => {
    const docRef = await doc(db, USERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data().favoriteAlbum;
};

//Audio db
const addUserFavoriteAudio = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAudio: arrayUnion({audioId: uid})
    });
};

const removeUserFavoriteAudio = async (db, id, uid) => {
    const userDbRef = await doc(db, USERS, id);
    await updateDoc(userDbRef, {
        favoriteAudio: arrayRemove({audioId: uid})
    });
};

const getFavoriteMusic = async (db, id) => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    return docSnap.data().favoriteAudio;
};


const getAudioStorage = async (storage, collection, id, setFunc) => {
    const pathReference = await ref(storage, `${collection}/${id}`);
    await getDownloadURL(pathReference)
    .then((url) => {
        setFunc(url);
    })
    .catch(() => {

    })  
};

//Id
const getAuthorId = async (db, collection, id, setFunc) => {
    const docRef = await doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data().authorId);
    return docSnap.data().authorId;
};

const getAlbumId = async (db, collection, id, setFunc) => {
    const docRef = await doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    await setFunc(docSnap.data().albumId);
    return docSnap.data().albumId;
};

//storage
const getImageStorage = async (storage, collection, id) => {
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

const downloadFile = async (pathReference, setFunc) => {
    getDownloadURL(pathReference)
    .then((url) => {
        setFunc(url);
    })
    .catch(() => {

    })
};

export {
    //General
    getDocDbAndSetState,
    getDocDbAndReturn,
    getDocDbAndSetStateWithoutPrev,
    //Album
    addUserFavoriteAlbum,
    removeUserFavoriteAlbum,
    getFavoriteAlbum,
    //Audio
    addUserFavoriteAudio,
    removeUserFavoriteAudio,
    getFavoriteMusic,
    getAudioStorage,
    //Id
    getAuthorId,
    getAlbumId,
    //storage
    getImageStorage,
    downloadFile
}