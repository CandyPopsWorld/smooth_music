const HOMEPAGE_HELMET = {
    title: 'Smooth Music - Главная',
    description: 'Smooth Music - сервис для удобного прослушивания музыки'
};

const LOGIN_HELMET = {
    title: 'Smooth Music - Вход',
    description: 'Вход'
};

const SIGNUP_HELMET = {
    title: 'Smooth Music - Регистрация',
    description: 'Регистрация'
};

const USERPAGE_HELMET = {
    title: 'Smooth Music - Собираем музыку для вас',
    description: 'Smooth Music - страница пользователя'
};

const SETTINGS_ACCOUNT_PAGE_HELMET = {
    title: 'Настройки аккаунта - Smooth Music',
    description: 'Настройки аккаунта - Smooth Music'
};

const SETTINGS_OTHER_PAGE_HELMET = {
    title: 'Прочие настройки - Smooth Music',
    description: 'Прочие настройки - Smooth Music'
};

const MOBILE_PAGE_HELMET = {
    title: 'Smooth Music - Установите мобильное приложение и слушайте музыку бесплатно в хорошем качестве',
    description: 'Smooth Music - Установите мобильное приложение и слушайте музыку бесплатно в хорошем качестве'
};

const ERROR_PAGE_HELMET = {
    title: 'Smooth Music - Что-то пошло не так',
    description: 'Smooth Music - Что-то пошло не так'
};

const SINGLE_ALBUM_PAGE_HELMET = (author, title) => {
    return {
        title: `${author} альбом ${title} слушать онлайн бесплатно на Smooth Music в хорошем качестве`,
        description: `${author} альбом ${title} слушать онлайн бесплатно на Smooth Music в хорошем качестве'`,
    }
};

const SINGLE_AUTHOR_PAGE_HELMET = (author) => {
    return {
        title: `${author} - слушать онлайн бесплатно на Smooth Music в хорошем качестве`,
        description: `${author} - слушать онлайн бесплатно на Smooth Music в хорошем качестве`, 
    }
};

const SINGLE_PLAYLIST_PAGE_HELMET = (playlist) => {
    return {
        title: `${playlist} - слушать онлайн бесплатно на Smooth Music в хорошем качестве`,
        description: `${playlist} - слушать онлайн бесплатно на Smooth Music в хорошем качестве`, 
    }
};

const COLLECTION_PLAYLISTS_PAGE_HELMET = (user) => {
    return {
        title: `${user}: Мои плейлисты на Smooth Music`,
        description: `${user}: Мои плейлисты на Smooth Music`,
    }
};

const COLLECTION_ALBUMS_PAGE_HELMET = (user) => {
    return {
        title: `${user}: Мои альбомы на Smooth Music`,
        description: `${user}: Мои альбомы на Smooth Music`,
    }
};

const COLLECTION_AUTHORS_PAGE_HELMET = (user) => {
    return {
        title: `${user}: Мои исполнители на Smooth Music`,
        description: `${user}: Мои исполнители на Smooth Music`,
    }
};

export 
{
    HOMEPAGE_HELMET, 
    LOGIN_HELMET, 
    SIGNUP_HELMET, 
    USERPAGE_HELMET,
    SETTINGS_ACCOUNT_PAGE_HELMET,
    SETTINGS_OTHER_PAGE_HELMET,
    MOBILE_PAGE_HELMET,
    ERROR_PAGE_HELMET,
    COLLECTION_ALBUMS_PAGE_HELMET,
    COLLECTION_AUTHORS_PAGE_HELMET,
    COLLECTION_PLAYLISTS_PAGE_HELMET, 
    SINGLE_ALBUM_PAGE_HELMET, 
    SINGLE_AUTHOR_PAGE_HELMET, 
    SINGLE_PLAYLIST_PAGE_HELMET
}