import { useCallback, useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";

export const useChangeBackGround = () => {
    const { isPagers } = useContext(GetFetchDataContext);

    const isDevMode: boolean = true; // 開発・本番環境モードの切替用Bool

    const locationPath: string = location.origin; // ドメインURLを取得
    const backGroundImgName: string = 'bg0'; // 画像データ名
    const imgExtend: string = '.jpg'; // 画像データの拡張子

    /* 開発・本番環境モード別の画像データ取得元パス */
    const _imgPath = (targetImgNum: number) => {
        if (isDevMode) {
            return `public/img/${backGroundImgName}${targetImgNum}-min${imgExtend}`; // 開発時
        } else {
            return `img/${backGroundImgName}${targetImgNum}-min${imgExtend}`; // 本番環境時
        }
    }

    /* 画像データをランダム表示するための数値を生成及び処理結果の画像をセット */
    const _getRandomNumber = (
        targetEl: HTMLElement,
        randomNum: number,
        targetImgSrcNum: string,
    ) => {
        let targetRandomNum: number = randomNum;

        /* ランダム数値が 0 または今表示中の画像データの場合は条件に応じて 1 を増減 */
        if (randomNum === 0 || String(randomNum) === targetImgSrcNum) {
            if (targetImgSrcNum === '6') {
                if (randomNum === 0) targetRandomNum = parseInt(targetImgSrcNum) - 1; // 5
                targetRandomNum = randomNum - 1; // 画像データの最大数（6枚目の場合は減算 = 5）
            } else {
                targetRandomNum = randomNum + 1;
            }
        }
        if (targetRandomNum <= 0) targetRandomNum + 1; // 負の値になった場合の回避策
        const imgPath = _imgPath(targetRandomNum);
        targetEl.style.setProperty('background-image', `url(${locationPath}/${imgPath})`);
    }

    /* ランダム数値が反映された背景画像データをセットする実施関数 */
    const ChangeBackGround = useCallback(() => {
        const PokeContent: HTMLElement | null = document.querySelector('.PokeContent');
        const randomNum: number = Math.floor(Math.random() * 6);

        if (PokeContent !== null) {
            const backgroundImageValue: string = getComputedStyle(PokeContent).backgroundImage; // getComputedStyle：引数に指定した DOM 要素から任意の CSSプロパティの値を取得
            const targetImgSrcNum = backgroundImageValue.split('-min')[0].split(backGroundImgName)[1];
            _getRandomNumber(PokeContent, randomNum, targetImgSrcNum);
        }
    }, [isPagers]);

    return { ChangeBackGround }
}