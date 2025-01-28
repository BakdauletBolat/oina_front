export function formatDateTime(dateString: string | null ): string {
    const date = parseDateString(dateString);
    if (!date) {
        return '';
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} секунд${getSuffix(diffInSeconds)} назад`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} минут${getSuffix(diffInMinutes)} назад`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} час${getSuffix(diffInHours)} назад`;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date >= today) {
        return "сегодня";
    }

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
    };

    if (date.getFullYear() !== now.getFullYear()) {
        options.year = "numeric";
    }

    return date.toLocaleDateString("ru-RU", options);
}

function getSuffix(value: number): string {
    if (value % 10 === 1 && value % 100 !== 11) return `а`;
    if (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20)) return `ы`;
    return ``;
}

export function parseDateString(dateStr: string | null): Date | null {
    if (!dateStr) return null;

    // Поддержка различных форматов даты
    const formats = [
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/, // ISO 8601 (2024-01-23T14:00:00.000Z)
        /^\d{4}-\d{2}-\d{2}$/, // ГГГГ-ММ-ДД (2024-01-23)
        /^\d{2}\.\d{2}\.\d{4}$/, // ДД.ММ.ГГГГ (23.01.2024)
        /^\d{4}\/\d{2}\/\d{2}$/, // ГГГГ/ММ/ДД (2024/01/23)
        /^\d{2}-\d{2}-\d{4}$/, // ДД-ММ-ГГГГ (23-01-2024)
    ];

    if (formats.some((regex) => regex.test(dateStr))) {
        const parsedDate = new Date(dateStr);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    return null;
}