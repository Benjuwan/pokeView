import { useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";

export const usePager = () => {
    const { isPagers, setPagers, isOffSet, isCurrPage, setCurrPage } = useContext(GetFetchDataContext);

    const prevPagerPages = () => {
        setPagers((_prevNum) => isPagers - isOffSet);
        setCurrPage((_prevCurrPage) => isCurrPage - 1);
        setTimeout(() => window.scrollTo(0, 0), 500);
    }

    const nextPagerPages = () => {
        setPagers((_prevNum) => isPagers + isOffSet);
        setCurrPage((_prevCurrPage) => isCurrPage + 1);
        setTimeout(() => window.scrollTo(0, 0), 500);
    }

    return { prevPagerPages, nextPagerPages }
}