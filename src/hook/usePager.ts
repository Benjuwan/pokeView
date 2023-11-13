import { useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";

export const usePager = () => {
    const { isPagers, setPagers, isOffSet, isCurrPage, setCurrPage } = useContext(GetFetchDataContext);

    const prevPagerPages = () => {
        setPagers((_prevNum) => isPagers - isOffSet);
        setCurrPage((_prevCurrPage) => isCurrPage - 1);
    }

    const nextPagerPages = () => {
        setPagers((_prevNum) => isPagers + isOffSet);
        setCurrPage((_prevCurrPage) => isCurrPage + 1);
    }

    return { prevPagerPages, nextPagerPages }
}