import { createContext, ReactNode, useState, FC } from "react";
import { pokeLists } from "../ts/GetFetchDataType";

type Default = {
    isPokeData: pokeLists[];
    setPokeData: React.Dispatch<React.SetStateAction<pokeLists[]>>;
    pagerLimitMaxNum: number;
    setPagerLimitMaxNum: React.Dispatch<React.SetStateAction<number>>;
    isPagers: number;
    setPagers: React.Dispatch<React.SetStateAction<number>>;
    isOffSet: number;
    isCurrPage: number;
    setCurrPage: React.Dispatch<React.SetStateAction<number>>;
}
export const GetFetchDataContext = createContext({} as Default);

type fragmentType = {
    children: ReactNode;
}
export const GetFetchDataContextFragment: FC<fragmentType> = ({ children }) => {
    /**
     * React では参照している Context が更新された時に再レンダリングされるため、本来は機能・用途ごとにそれぞれファイルを分けて用意するべきだが今回は機能として「連携・連動している」のでまとめて記述している
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

    return (
        <GetFetchDataContext.Provider value={{
            isPokeData, setPokeData,
            pagerLimitMaxNum, setPagerLimitMaxNum,
            isPagers, setPagers,
            isOffSet,
            isCurrPage, setCurrPage
        }}>
            {children}
        </GetFetchDataContext.Provider>
    );
}