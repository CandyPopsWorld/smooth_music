import { clearAllDataUser, deleteUserProfile } from "../functions/setting";

export const dangerZoneElements = [
    {header: 'Удалить аккаунт', description: `Как только вы удаляете аккаунт, пути назад уже не будет. Пожалуйста, будьте уверены.<span class='danger_red_text'>(После нажатия на кнопку действие отменить невозможно!)</span>`, btnText: 'Удалить', action: (user, db, storage, setLoading) => deleteUserProfile(user, db, storage, setLoading), id: 1},
    {header: 'Сбросить данные аккаунта', description: `Как только вы сбросите данные аккаунта, пути назад уже не будет. Пожалуйста, будьте уверены.<span class='danger_red_text'>(После нажатия на кнопку действие отменить невозможно!)</span>`, btnText: 'Сбросить', action: (user, db, storage, setLoading) => clearAllDataUser(user, db, storage, setLoading), id: 2},
];

export const languageLocation = [
    {countryLogo: '', title: 'ru', id: 1},
    {countryLogo: '', title: 'en', id: 2},
];