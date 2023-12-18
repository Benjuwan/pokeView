import { useCallback, useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";

export const useChangeBackGround = () => {
    const { isPagers } = useContext(GetFetchDataContext);

    const isDevMode: boolean = true; // 開発・本番環境モードの切替用Bool

    const locationPath: string = location.origin; // ドメインURLを取得
    const backGroundImgName: string = 'bg0'; // 画像データ名
    const imgExtend: string = '.jpg'; // 画像データの拡張子

    /* ランダム表示する背景画像データを用意 */
    const _getRandomNumber: (targetEl: HTMLElement, randomNum: number) => void = (targetEl: HTMLElement, randomNum: number) => {
        let imgPath: string = '';
        if (isDevMode) {
            imgPath = `public/img/${backGroundImgName}${randomNum}-min${imgExtend}`; // 開発時
        } else {
            imgPath = `img/${backGroundImgName}${randomNum}-min${imgExtend}`; // 本番環境時
        }
        targetEl.style.setProperty('background-image', `url(${locationPath}/${imgPath})`);
    }

    /* ランダム数値が反映された背景画像データをセットする実施関数 */
    const ChangeBackGround: () => void = useCallback(() => {
        const PokeContent: HTMLElement | null = document.querySelector('.PokeContent');
        const randomNum: number = Math.floor(Math.random() * 6); // public/img にある背景画像の枚数（6）を指定

        if (PokeContent !== null) {
            const backgroundImageValue: string = getComputedStyle(PokeContent).backgroundImage; // getComputedStyle：引数に指定した DOM 要素から任意の CSSプロパティの値を取得
            const targetImgSrcNum = backgroundImageValue.split('-min')[0].split(backGroundImgName)[1];
            /* ランダム数値が 0 または今表示中の画像データのナンバリングと合致する場合は 1 を渡す（ナンバリング 1 の画像を表示）*/
            if (randomNum === 0 || randomNum === parseInt(targetImgSrcNum)) {
                _getRandomNumber(PokeContent, 1);
            } else {
                _getRandomNumber(PokeContent, randomNum);
            }
        }
    }, [isPagers]);

    return { ChangeBackGround }
}