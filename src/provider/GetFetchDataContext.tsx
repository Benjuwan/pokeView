import { createContext } from "react";
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
    isLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GetFetchDataContext = createContext({} as Default);