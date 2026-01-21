import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface CourseThumbnailProps {
    src: string;
    alt: string;
    className?: string;
}

export const CourseThumbnail = ({ src, alt, className = '' }: CourseThumbnailProps) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasError(false);
    }, [src]);

    if (hasError || !src) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                aria-label={alt}
                role="img"
            >
                <ImageOff className="w-10 h-10 text-gray-400" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
};
