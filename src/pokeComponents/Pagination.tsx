import { memo, useState, useEffect, useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { useChangeBackGround } from "../hook/useChangeBackGround";
import { useCurrPagerSelect } from "../hook/useCurrPagerSelect";

export const Pagination = memo(() => {
    const { isPokeData, pagerLimitMaxNum, setPagers, isOffSet, isCurrPage, setCurrPage } = useContext(GetFetchDataContext);

    /* ページ数：コンテンツデータ数をオフセットで分割した数 */
    const [isPagination, setPagination] = useState<number[]>([]);

    /* ページャー数 */
    const [isPagerNum, setPagerNum] = useState<number[]>([]);

    /* 各ページャー項目の data-pager の値に準じたページを表示及びページ番号を変更 */
    const setPaginationNum: (btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>, pagerEl: number) => void = (
        btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        pagerEl: number
    ) => {
        const dataPager: string | null = btnEl.currentTarget.getAttribute('data-pager');
        setPagers(Number(dataPager));
        setCurrPage(pagerEl); // 表示中のページ番号を変更
        setTimeout(() => window.scrollTo(0, 0), 500); // スクロールトップ
    }

    /* ランダム数値が反映された背景画像データをセットする実施関数 */
    const { ChangeBackGround } = useChangeBackGround();

    /* isCurrPage State を依存配列に指定して使用し、当該 State が更新される度に現在ページのシグナル移行処理を行う。※「前のページ」「次のページ」クリック時にもシグナル移行を実現するための専用メソッド */
    const { CheckCurrPager } = useCurrPagerSelect();
    useEffect(() => {
        ChangeBackGround();
        CheckCurrPager(isCurrPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCurrPage]);

    /* オフセット数に基づいた計算を通してページネーション用の各ページャー項目のページを設定する */
    const basedonOffsetNum_setPagerNum: () => void = () => {
        /* 初期表示時（isPagination が 0件）という条件を指定して再レンダリングに伴う倍数増加（下記処理実行）を防止 */
        if (isPagination.length <= 0) {
            const srcAry: number[] = [];
            let srcNum: number = pagerLimitMaxNum;

            /* 各ページャー項目の data-pager の値を生成（引算用途の上限数値：srcNum が 0 を切るまでオフセット数を倍数していくループ処理）*/
            let Accumuration = 0;
            while (srcNum > 0) {
                srcAry.push(isOffSet * Accumuration);
                Accumuration++;
                srcNum = srcNum - isOffSet;
            }
            setPagerNum([...isPagerNum, ...srcAry]); // ページャー数をセット

            const paginationAry: number[] = [];
            for (let i = 1; i <= srcAry.length; i++) {
                paginationAry.push(i);
            }
            setPagination([...isPagination, ...paginationAry]); // ページ数をセット
        }
    }
    useEffect(() => {
        basedonOffsetNum_setPagerNum();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPokeData]);

    return (
        <div className="w-[clamp(15rem,100%,60rem)] mx-auto mb-4 flex flex-wrap items-center gap-[5%] md:gap-[2%]">
            <p className="w-full text-xs leading-8">現在表示しているのは「{isCurrPage}」ページ目です。</p>
            {isPagination.map((pagerEl, i) =>
                <button
                    key={pagerEl}
                    className="pagerLists cursor-pointer appearance-none min-w-8 mb-2 grid place-content-center relative before:block before:content[''] before:w-11 before:h-11 before:rounded-8 before:absolute before:-z-1 before:m-auto before:inset-0 before:transform-[scaleY(.5)translateX(0%)]"
                    data-current={i === 0}
                    data-pager={isPagerNum[i]}
                    onClick={(btnEl) => {
                        setPaginationNum(btnEl, pagerEl);
                    }}
                >
                    {pagerEl}
                </button>
            )}
        </div>
    );
});