import React, { useEffect, useRef, useState } from 'react';

const LottieAnimation = () => {
    const [isClient, setIsClient] = useState(false);
    const lottieContainer = useRef(null);

    useEffect(() => {
        setIsClient(true);
        if (isClient) {
            import('lottie-web').then((lottie) => {
                lottie.loadAnimation({
                    container: lottieContainer.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: require('./Recording2.json'),
                });
            });
        }
    }, [isClient]);

    return <div ref={lottieContainer} className='w-[30px] h-[40px] '/>;
};

export default LottieAnimation;
