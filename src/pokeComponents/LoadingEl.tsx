import { memo, useEffect } from "react";
import styled from "styled-components";

export const LoadingEl = memo(() => {
    /* ローディングテキストのアニメーション演出の準備と補助 */
    useEffect(() => {
        const isLoadingEl: HTMLParagraphElement | null = document.querySelector('.isLoading');
        const isLoadingElWords: string[] | undefined = isLoadingEl?.textContent?.split('');
        const loadingWords: string[] | undefined = isLoadingElWords?.map((word, i) => {
            return `<span class="txtFrames" style="animation-delay:${(i + 1) * 0.025}s">${word}</span>`;
        });

        if (
            isLoadingEl !== null &&
            typeof loadingWords !== "undefined"
        ) {
            isLoadingEl.innerHTML = loadingWords?.join('');
        }
    }, []);

    return <LoadingElm className="isLoading">...データを取得中</LoadingElm>
});

const LoadingElm = styled.p`
overflow: hidden;
letter-spacing: .25em;
text-align: center;
font-size: 1.6rem;
line-height: 2;
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);

@media screen and (min-width: 700px) {
    font-size: 18px;
}

& span {
    display: inline-block;
    transform: translateY(1em);

    &.txtFrames{
        animation: txtFrames .75s infinite ease-in-out;

        @keyframes txtFrames {
            0%{transform:translateY(1em)}
            50%, 100%{transform:translateY(0)}
        }
    }
}
`;