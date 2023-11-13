import { memo, useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { GetFetchDataContext } from "./provider/GetFetchDataContext";

export const Pagination = memo(() => {
    const { isPokeData, pagerLimitMaxNum, setPagers, isOffSet, isCurrPage, setCurrPage } = useContext(GetFetchDataContext);

    /* ページ数：コンテンツデータ数をオフセットで分割した数 */
    const [isPagination, setPagination] = useState<number[]>([]);

    /* ページャー数 */
    const [isPagerNum, setPagerNum] = useState<number[]>([]);

    /* 各ページャー項目の data-pager の値に準じたページを表示 */
    const setPaginationNum = (
        btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        pagerEl: number
    ) => {
        const dataPager: string | null = btnEl.currentTarget.getAttribute('data-pager');
        setPagers((_prevPagerNum) => Number(dataPager));
        setCurrPage((_prevCurrPage) => pagerEl);
        window.scrollTo(0, 0); // スクロールトップ
    }

    useEffect(() => {
        /* 初期表示時（isPagination が 0件）という条件を指定して再レンダリングに伴う倍数増加（下記処理実行）を防止 */
        if (isPagination.length <= 0) {
            const srcAry: number[] = [];
            let srcNum: number = pagerLimitMaxNum;

            /* 各ページャー項目の data-pager の値を生成（引算用途の上限数値：srcNum が 0 を切るまでオフセット数を倍数していくループ処理）*/
            let Accumuration = 0;
            while (srcNum >= 0) {
                srcAry.push(isOffSet * Accumuration);
                Accumuration++;
                srcNum = srcNum - isOffSet;
            }
            setPagerNum((_prevPagerNum) => [...isPagerNum, ...srcAry]); // ページャー数をセット

            const paginationAry: number[] = [];
            for (let i = 1; i <= srcAry.length; i++) {
                paginationAry.push(i);
            }
            setPagination((_prevPagination) => [...isPagination, ...paginationAry]); // ページ数をセット
        }
    }, [isPokeData]);

    return (
        <Paginations>
            <p className="currPage">現在表示しているのは「{isCurrPage}」ページ目です。</p>
            {isPagination.map((pagerEl, i) =>
                /* data-pager：ページャー数がセットされたカスタムデータ */
                <button key={i} data-pager={isPagerNum[i]} onClick={(btnEl) => {
                    setPaginationNum(btnEl, pagerEl);
                }}>{pagerEl}</button>
            )}
        </Paginations>
    );
});

const Paginations = styled.div`
width: clamp(240px, 100%, 960px);
margin: 0 auto 1em;
display: flex;
flex-flow: row wrap;
gap: 2%;

& .currPage{
    width: 100%;
    font-size: 12px;
    line-height: 2;
}

& button{
    cursor: pointer;
    appearance: none;
    border: 1px solid #dadada;
    border-radius: 0;
    background-color: #eaeaea;
    min-width: 32px;
    margin-bottom: .5em;

    &:hover{
        background-color: #333;
        color: #fff;
        border-color: #fff;
    }
}
`;