import { useEffect, useState } from "react";

export function useDebounce(value, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(id); // switch logic: отменяем предыдущий таймер
    }, [value, delay]);

    return debouncedValue;
}
