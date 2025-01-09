import { ChangeEvent, memo, useContext, useState, useEffect } from "react";
import styled from "styled-components";
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
        <FilterPoke>
            <form action="" onSubmit={(formEl: ChangeEvent<HTMLFormElement>) => {
                formEl.preventDefault();
                filterPokeName();
            }}>
                <input type="text" value={isTargetPokeName} onInput={(inputEl: ChangeEvent<HTMLInputElement>) => {
                    setPokeName(inputEl.target.value);
                }} />
                <button type="button" onClick={filterPokeName} disabled={isTargetPokeName.length <= 0}><img src={monsterBall} alt="モンスターボールのアイコン" />好きなポケモンをさがす</button>
            </form>
            {isFilterPoke.length > 0 &&
                <div className="filterPokeContents">
                    {
                        isFilterPoke.map(filterPokeData => <PokeItems pokeData={filterPokeData} key={filterPokeData.id} />)
                    }
                </div>
            }
        </FilterPoke>
    );
});

const FilterPoke = styled.div`
width: 100%;
margin-bottom: 1em;

& form {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    margin-bottom: 1em;

    & input[type="text"] {
        border: 1px solid #868686;
        border-radius: 4px;
        margin-right: .5em;
        font-size: 16px;
        padding-left: .25em;
        margin-bottom: .5em;

        @media screen and (min-width: 700px) {
            margin-bottom: 0;
        }
    }
    
    & button {
        appearance: none;
        border-radius: 30px;
        border: 1px solid #dadada;
        background-color: #eaeaea;
        padding: .25em 1em .25em .25em;
        display: flex;
        align-items: center;
        letter-spacing: .25em;
        font-size: 1.4rem;

        &[disabled] {
            filter: grayscale(1);
        }
        
        &:not([disabled]):hover {
            cursor: pointer;
            filter: brightness(1.1);
        }

        @media screen and (min-width: 700px) {
            font-size: 14px;
        }
        
        & img {
            display: block;
            margin-right: .5em;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;

            @media screen and (min-width: 700px) {
                width: 30px;
                height: 30px;
            }
        }
    }
}

& .filterPokeContents {
    width: 100%;
    margin: 1em auto;
    margin-bottom: 8em;
    border-bottom: 1px dotted #333;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    gap: 5%;

    @media screen and (min-width: 700px) {
        margin-bottom: 4em;
    }
}
`;