import { useEffect, useRef, useState } from "react";
import "./LazyImage.css";

export default function LazyImage({ src, alt, className = "", ...rest }) {
    const [isVisible, setIsVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "100px",
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} className={`lazy-image-wrapper ${className}`}>
            {!loaded && <div className="skeleton skeleton-image" />}

            {isVisible && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    style={!loaded ? { display: "none" } : {}}
                    {...rest}
                />
            )}
        </div>
    );
}
