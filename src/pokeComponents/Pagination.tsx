import { memo, useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { useChangeBackGround } from "../hook/useChangeBackGround";
import { useCurrPagerSelect } from "../hook/useCurrPagerSelect";

import monsterBall from "../../src/assets/monsterBall-min.png";

export const Pagination = memo(() => {
    const { isPokeData, pagerLimitMaxNum, setPagers, isOffSet, isCurrPage, setCurrPage } = useContext(GetFetchDataContext);

    /* ページ数：コンテンツデータ数をオフセットで分割した数 */
    const [isPagination, setPagination] = useState<number[]>([]);

    /* ページャー数 */
    const [isPagerNum, setPagerNum] = useState<number[]>([]);

    /* 各ページャー項目の data-pager の値に準じたページを表示及びページ番号を変更 */
    const setPaginationNum = (
        btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        pagerEl: number
    ) => {
        const dataPager: string | null = btnEl.currentTarget.getAttribute('data-pager');
        setPagers((_prevPagerNum) => Number(dataPager));
        setCurrPage((_prevCurrPage) => pagerEl); // 表示中のページ番号を変更
        setTimeout(() => window.scrollTo(0, 0), 500); // スクロールトップ
    }

    /* ランダム数値が反映された背景画像データをセットする実施関数 */
    const { ChangeBackGround } = useChangeBackGround();

    /* isCurrPage State を依存配列に指定して使用し、当該 State が更新される度に現在ページのシグナル移行処理を行う。※「前のページ」「次のページ」クリック時にもシグナル移行を実現するための専用メソッド */
    const { CheckCurrPager } = useCurrPagerSelect();
    useEffect(() => {
        ChangeBackGround();
        CheckCurrPager(isCurrPage);
    }, [isCurrPage]);

    /* オフセット数に基づいた計算を通してページネーション用の各ページャー項目のページを設定する */
    const basedonOffsetNum_setPagerNum = () => {
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
    }
    useEffect(() => {
        basedonOffsetNum_setPagerNum();
    }, [isPokeData]);

    return (
        <Paginations>
            <p className="currPage">現在表示しているのは「{isCurrPage}」ページ目です。</p>
            {isPagination.map((pagerEl, i) =>
                /* data-pager：ページャー数がセットされたカスタムデータ */
                <button key={i}
                    className={`pagerLists ${i === 0 && 'afterRender'}`}
                    data-current={i === 0}
                    data-pager={isPagerNum[i]}
                    onClick={(btnEl) => {
                        setPaginationNum(btnEl, pagerEl);
                    }}>{pagerEl}
                </button>
            )}
        </Paginations>
    );
});

const Paginations = styled.div`
width: clamp(240px, 100%, 960px);
margin: 0 auto 1em;
display: flex;
flex-flow: row wrap;
align-items: center;
gap: 2%;

& .currPage{
    width: 100%;
    font-size: 12px;
    line-height: 2;
}

& button{
    cursor: pointer;
    appearance: none;
    border-radius: 0;
    border: 0;
    background-color: transparent;
    min-width: 32px;
    margin-bottom: .5em;
    
    &.pagerLists{
        position: relative;
        color: #fff;
        background-color: #333;
        border-radius: 8px;
        padding: .25em;
        
        &[data-current="true"],
        &.afterRender{
            font-weight: bold;
            color: #333;
            background-color: transparent;
            padding: 1em 1.25em;

            &::before {
                background: url(${monsterBall})no-repeat center center/cover;
                border-radius: 50%;
                box-shadow: 0 0 8px rgba(0, 0, 0, .5);
                opacity: .75;
                /* data-current が付いているものはスタイルを正す */
                transform: scaleY(1) translateX(0%); 
            }
        }
        
        &::before {
            display: block;
            content: "";
            width: 100%;
            height: 100%;
            border-radius: 8px;
            position: absolute;
            z-index: -1;
            margin: auto;
            inset: 0;
            /* 縮小 → 拡大を実現するため scaleY(.5) で縦を縮めておく */
            transform: scaleY(.5) translateX(0%);
        }
        
        &.prev{
            &::before{
                left: 50%;
                /* 縮小 → 拡大を実現するため scaleY(1) */
                transform: scaleY(1) translateX(-50%);
                transition: transform .5s;
            }
        }
        
        &.next{
            &::before{
                left: auto;
                right: 50%;
                /* 縮小 → 拡大を実現するため scaleY(1) */
                transform: scaleY(1) translateX(50%);
                transition: transform .5s;
            }
        }
    }
}
`;