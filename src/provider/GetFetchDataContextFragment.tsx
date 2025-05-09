import { ReactNode, FC, useState } from "react";
import { GetFetchDataContext } from "./GetFetchDataContext";
import { pokeLists } from "../ts/GetFetchDataType";

type fragmentType = {
    children: ReactNode;
};

export const GetFetchDataContextFragment: FC<fragmentType> = ({ children }) => {
    /**
     * React では参照している Context が更新された時に（参照している各コンポーネントが）再レンダリングされるため、本来は機能・用途ごとにそれぞれ provider ファイルを分けて用意するべきだが今回は機能として「連携・連動している」のでまとめて記述している
    */

    /* コンテンツデータ格納用の配列 State */
    const [isPokeData, setPokeData] = useState<pokeLists[]>([]);

    /* 上限値（取得したコンテンツデータの総数） */
    const [pagerLimitMaxNum, setPagerLimitMaxNum] = useState<number>(0);

    /* ページャー数の管理用 State */
    const [isPagers, setPagers] = useState<number>(0);

    /* ページャーの offset 値 */
    const [isOffSet] = useState<number>(50);

    /* 現在表示中のページ番号 */
    const [isCurrPage, setCurrPage] = useState<number>(1);

    /* ローディング */
    const [isLoading, setLoading] = useState<boolean>(false);

    return (
        <GetFetchDataContext.Provider value={{
            isPokeData, setPokeData,
            pagerLimitMaxNum, setPagerLimitMaxNum,
            isPagers, setPagers,
            isOffSet,
            isCurrPage, setCurrPage,
            isLoading, setLoading
        }}>
            {children}
        </GetFetchDataContext.Provider>
    );
}