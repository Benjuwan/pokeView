import { memo, useEffect, useRef } from "react";

export const LoadingEl = memo(() => {
    /* ローディングテキストのアニメーション演出の準備と補助 */
    const loadingElmRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        const isLoadingElWords: string[] | undefined = loadingElmRef.current?.textContent?.split('');
        const loadingWords: string[] | undefined = isLoadingElWords?.map((word, i) => {
            return `<span class="txtFrames inline-block transform-[translateY(1em)]" style="animation-delay:${(i + 1) * 0.025}s">${word}</span>`;
        });

        if (
            loadingElmRef.current !== null &&
            typeof loadingWords !== "undefined"
        ) {
            loadingElmRef.current.innerHTML = loadingWords?.join('');
        }
    }, []);

    return <p className="overflow-hidden tracking-[0.25em] text-center text-[1rem] leading-[2] fixed top-[50%] left-[50%] transform-[translate(-50%,-50%)]" ref={loadingElmRef}>...データを取得中</p>
});