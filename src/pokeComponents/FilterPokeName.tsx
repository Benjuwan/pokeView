import { ChangeEvent, memo, useContext, useState, useEffect } from "react";
import { pokeLists } from "../ts/GetFetchDataType";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { PokeItems } from "./PokeItems";

import monsterBall from "../../src/assets/monsterBall-min.png";

export const FilterPokeName = memo(() => {
    /* 各種 Context */
    const { isPokeData, isPagers } = useContext(GetFetchDataContext);

    /* ページ遷移に伴う初期化処理 */
    useEffect(() => {
        setTargetPokeName('');
        setFilterPoke([]);
    }, [isPagers]);

    /* 検索結果を反映するフィルター用の State */
    const [isFilterPoke, setFilterPoke] = useState<pokeLists[]>([]);

    /* 入力内容の State と反映させるための関数 */
    const [isTargetPokeName, setTargetPokeName] = useState<string>('');
    const setPokeName: (inputTxt: string) => void = (inputTxt: string) => {
        const targetPokeName: string = inputTxt;
        setTargetPokeName(targetPokeName);
    }

    /* 検索結果（入力内容）を反映させる関数 */
    const filterPokeName: () => void = () => {
        setFilterPoke([]);
        if (isTargetPokeName.length > 0) {
            const filterPokeName = isPokeData.filter(pokeData => {
                if (pokeData.name.match(isTargetPokeName)) {
                    return pokeData;
                }
            });

            if (filterPokeName.length === 0) {
                alert(`探そうとしている「${isTargetPokeName}」は存在しません`);
                setTargetPokeName('');
                return; // 処理終了
            }
            setFilterPoke(filterPokeName);
            setTargetPokeName('');
        }
    }

    return (
        <div className="w-full mb-4">
            <form className="flex items-center flex-wrap mb-4" onSubmit={(formEl: ChangeEvent<HTMLFormElement>) => {
                formEl.preventDefault();
                filterPokeName();
            }}>
                <input
                    type="text"
                    value={isTargetPokeName}
                    className="border border-[#868686] rounded-md mr-2 text-base pl-1 mb-2 md:mb-0"
                    onInput={(inputEl: ChangeEvent<HTMLInputElement>) => {
                        setPokeName(inputEl.target.value);
                    }}
                />
                <button
                    type="button"
                    onClick={filterPokeName}
                    disabled={isTargetPokeName.length <= 0}
                    className="appearance-none rounded-[30px] border border-[#dadada] bg-[#eaeaea] py-1 pl-1 pr-4 flex items-center tracking-[0.25em] text-sm disabled:grayscale enabled:hover:cursor-pointer enabled:hover:brightness-110"
                >
                    <img
                        src={monsterBall}
                        alt="モンスターボールのアイコン"
                        className="block mr-2 rounded-full w-[2rem] h-[2rem]"
                    />
                    好きなポケモンをさがす
                </button>
            </form>
            {isFilterPoke.length > 0 &&
                <div className="w-full mx-auto mt-4 mb-32 md:mb-16 border-b border-dotted border-[#333] flex flex-wrap justify-start gap-[5%]">
                    {
                        isFilterPoke.map(filterPokeData => <PokeItems pokeData={filterPokeData} key={filterPokeData.id} />)
                    }
                </div>
            }
        </div>
    );
});