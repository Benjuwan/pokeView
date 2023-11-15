import { useCallback, useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";

export const useChangeBackGround = () => {
    const { isPagers } = useContext(GetFetchDataContext);

    const isDevMode: boolean = true; // 開発・本番環境モードの切替用Bool

    const locationPath: string = location.origin; // ドメインURL
    const backGroundImgName: string = 'bg0'; // 画像データ名
    const imgExtend: string = '.jpg'; // 画像データの拡張子

    /* 開発・本番環境モード別の画像データ取得元パス */
    const _imgPath = (targetImgNum: number) => {
        if (isDevMode) return `src/assets/img/${backGroundImgName}${targetImgNum}-min${imgExtend}`; // 開発時
        else return `assets/img/${backGroundImgName}${targetImgNum}-min${imgExtend}`; // 本番環境時
    }

    /* 画像データをランダム表示するための数値を生成及び処理結果の画像をセット */
    const _getRandomNumber = (
        targetEl: HTMLElement,
        randomNum: number,
        targetImgSrcNum: string,
    ) => {
        /* ランダム数値が 0 または今表示中の画像データの場合は再処理する */
        if (randomNum === 0 || String(`0${randomNum}`) === targetImgSrcNum) {
            const randomNumAgain: number = Math.floor(Math.random() * 6);
            const imgPath = _imgPath(randomNumAgain);
            targetEl.style.setProperty('background-image', `url(${locationPath}/${imgPath})`);
        } else {
            const imgPath = _imgPath(randomNum);
            targetEl.style.setProperty('background-image', `url(${locationPath}/${imgPath})`);
        }

    }

    /* ランダム数値が反映された背景画像データをセットする実施関数 */
    const ChangeBackGround = useCallback(() => {
        const PokeContent: HTMLElement | null = document.querySelector('.PokeContent');
        const randomNum: number = Math.floor(Math.random() * 6);

        if (PokeContent !== null) {
            const backgroundImageValue: string = getComputedStyle(PokeContent).backgroundImage;
            const targetImgSrcNum = backgroundImageValue.split('-min')[0].split('bg')[1];
            _getRandomNumber(PokeContent, randomNum, targetImgSrcNum);
        }
    }, [isPagers]);

    return { ChangeBackGround }
}