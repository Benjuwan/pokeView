import { useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";

export const usePager = () => {
    const { isPagers, setPagers, isOffSet, isCurrPage, setCurrPage } = useContext(GetFetchDataContext);

    const prevPagerPages: () => void = () => {
        setPagers(isPagers - isOffSet);
        setCurrPage(isCurrPage - 1);
        setTimeout(() => window.scrollTo(0, 0), 500);
    }

    const nextPagerPages: () => void = () => {
        setPagers(isPagers + isOffSet);
        setCurrPage(isCurrPage + 1);
        setTimeout(() => window.scrollTo(0, 0), 500);
    }

    return { prevPagerPages, nextPagerPages }
}