import { deleteUser, updateProfile } from "firebase/auth";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {refreshPage} from './helper';
import {USERS} from '../data/collectionsId';
import { deleteObject, ref } from "firebase/storage";
import { AVATAR_STORAGE } from "../data/storageId";
import { localSettings } from "../data/localStorage";


export const deleteUserProfile = async (user , db, storage, setLoading) => {
    await setLoading(true);
    await deleteDoc(doc(db, USERS, user.uid));

    if(localStorage.getItem(user.uid)){
        await localStorage.removeItem(user.uid);
    }
    
    const avatarRef = await ref(storage, `${AVATAR_STORAGE}/${user.uid}`);
    if(avatarRef){
        await deleteObject(avatarRef).then(() => {
        }).catch((error) => {
        });
    }

    await deleteUser(user).then(() => {
        refreshPage();
    }).catch((error) => {
        
    });
};

export const clearAllDataUser = async (user, db, storage, setLoading) => {
    await setLoading(true)
    await updateProfile(user, {
        photoURL: ''
    }).then(() =>{

    }).catch((error) => {
        
    })

    const userRef = await doc(db, USERS, user.uid);
    await updateDoc(userRef, {
        banAudio: deleteField(),
        favoriteAlbum: deleteField(),
        favoriteAudio: deleteField(),
        favoriteAuthor: deleteField(),
        maxIdPlaylist: deleteField(),
        music: deleteField(),
        playlists: deleteField(),
    });

    await updateDoc(userRef, {
        banAudio: [],
        favoriteAlbum: [],
        favoriteAudio: [],
        favoriteAuthor: [],
        maxIdPlaylist: '0',
        music: [],
        playlists: [],
    });

    if(localStorage.getItem(user.uid)){
        await localStorage.removeItem(user.uid);
    }

    if(localStorage.getItem(user.uid)){

    } else{
        await localStorage.setItem(user.uid,JSON.stringify(localSettings));
    }
    
    const avatarRef = await ref(storage, `${AVATAR_STORAGE}/${user.uid}`);
    if(avatarRef){
        await deleteObject(avatarRef).then(() => {
        }).catch((error) => {
        });
    }

    await refreshPage();
};