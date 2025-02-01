export function share(page: string, title: string) {
    const url = import.meta.env.VITE_APP_FRONT_URL + page;
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        })
            .then(() => console.log('Ссылка успешно отправлена'))
            .catch((error) => console.log('Ошибка при отправке:', error));
    } else {
        alert('Ваш браузер не поддерживает функцию обмена.');
    }
}