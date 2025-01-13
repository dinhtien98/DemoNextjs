export const formatDate = (dateString: string, format: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const map: { [key: string]: string } = {
        dd: String(date.getDate()).padStart(2, '0'),
        mm: String(date.getMonth() + 1).padStart(2, '0'),
        yyyy: date.getFullYear().toString(),
        HH: String(date.getHours()).padStart(2, '0'),
        MM: String(date.getMinutes()).padStart(2, '0'),
    };

    return format.replace(/dd|mm|yyyy|HH|MM/g, (matched) => map[matched]);
};
