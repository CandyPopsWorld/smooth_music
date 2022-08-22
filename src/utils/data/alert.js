export const errorsAlert = [
    {code: 'auth/email-already-in-use', message: 'Пользователь с таким email зарегистрирован!'},
    {code: 'auth/invalid-email', message: 'Неккоректна введена почта!'},
    {code: 'auth/wrong-password', message: 'Неккорекно введен пароль!'},
    {code: 'auth/too-many-requests', message: 'Произошла ошибка! Слишком много запросов! Попробуйте позднее!'},
    {code: 'auth/weak-password', message: 'Ваш пароль очень слабый!'},
    {code: '"auth/user-not-found"', message: 'Пользователь не найден!'},
    {code: 'auth/email-already-in-use', message: 'Электронная почта уже используется!'},
];

export const defaultErrorText = 'Произошла ошибка! Попробуйте еще раз!';
export const defaultMailVereficationText = 'Письмо с подтверждением отправлено на вашу почту!';

export const forgotPasswordText = 'Ссылка для сброса пароля отправлена на вашу почту!';

export const validateUsernameText = 'Никнейм должен быть больше 3 символов и меньше 30!';
export const validatePasswordText = 'Пароль должен быть длиннее 5 символов!';
export const validateConfirmPasswordText = 'Пароли должны совпадать';
export const validateEmailText = 'Некорретно введена почта!';