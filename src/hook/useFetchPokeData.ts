import { useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { pokeAry, pokeFetchData, pokeLists, speciesItems, pokeNameLocalJsonFile } from "../ts/GetFetchDataType";

export const useFetchPokeData = () => {
    const { setPokeData, setPagerLimitMaxNum, setLoading } = useContext(GetFetchDataContext);

    const isDevMode: boolean = true; // 開発・本番環境モードの切替用Bool

    const FetchPokeData = (url: string) => {
        setLoading(true); // ローディング開始

        /* pokemon.json から各ポケモンの英語名と日本語名を取得 */
        const _FetchPokeName = async () => {
            let fetchPath: string = '';
            if (isDevMode) {
                fetchPath = `${location.origin}/public/json/pokemon.json`; // 開発時
            } else {
                fetchPath = `${location.origin}/json/pokemon.json`; // 本番環境時
            }
            const respone = await fetch(fetchPath);
            const resObj: pokeNameLocalJsonFile[] = await respone.json();
            return resObj.map(resObjEl => resObjEl);
        }

        /* ポケモン名を「英語名 → 日本語名」に置換 */
        const _replacePokeName_enToja = (
            targetAry: pokeNameLocalJsonFile[],
            originName: pokeLists // 配列（オブジェクト）の中身として指定
        ) => {
            targetAry.forEach(pokeName => {
                /* 置換処理に必要な文字列マッチングを行うために、それぞれ大文字（toLowerCase：小文字でもok）にする */
                const UpperCase_jsonPokeName_en: string = pokeName.en.toUpperCase();
                const UpperCase_fetchPokeName: string = originName.name.toUpperCase();
                if (UpperCase_jsonPokeName_en === UpperCase_fetchPokeName) {
                    originName.name = pokeName.ja;
                }
            });
        }

        /* ポケモンデータを取得 */
        const fetchPokeData = async () => {
            const FetchPokeName = await _FetchPokeName(); // 各ポケモンの英語・日本語名が格納されている配列

            const respone = await fetch(url);
            const resObj: pokeFetchData = await respone.json();
            const resObjResult: pokeAry[] = resObj.results;
            setPagerLimitMaxNum((_prevPagerLimitMaxNum) => resObj.count); // 上限値の設定

            resObjResult.forEach(pokeDataSrc => {
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokeDataSrc.name}/`).then(res => res.json()).then((pokeData: pokeLists) => {
                    /* then((pokeData: pokeLists)：配列（オブジェクト）の中身として指定 */

                    if (typeof pokeData.species !== "undefined") {
                        fetch(pokeData.species.url).then(res => res.json()).then(speciesItems => {
                            /* pokeData のように「then((pokeData: pokeLists) ...」の記述で型注釈ができなかったので、speciesItems: any に型を付与するため変数（speciesData）を生成して、speciesData で処理を進める */
                            const speciesData: speciesItems = speciesItems;

                            /* flavorTextAry：各ポケモンのシリーズごとの紹介文章を格納した配列（日本語データのみを取得している）*/
                            const flavorTextAry: speciesItems[] = speciesData.flavor_text_entries.filter(flavorText => {
                                /* 日本語データのみを取得 */
                                if (flavorText.language.name === 'ja') {
                                    return flavorText.flavor_text;
                                }
                            });
                            // console.log(flavorTextAry); // 配列の index番号の違いで verごとの紹介文が取得できる。現状は[0]で初期verの紹介文

                            /* ポケモン名を「英語名 → 日本語名」にする */
                            _replacePokeName_enToja(FetchPokeName, pokeData);

                            /* 取得する各種データのオブジェクトとデータの反映 */
                            const newList: pokeLists = {
                                id: pokeData.id,
                                name: pokeData.name,
                                height: pokeData.height,
                                weight: pokeData.weight,
                                img: pokeData.sprites?.front_default,
                                officialImg: pokeData.sprites?.other["official-artwork"].front_default,
                                type: speciesData.genera[0].genus,
                                flavor_text: flavorTextAry[0]
                            }
                            setPokeData((_prevPokeData) => [..._prevPokeData, newList]);

                            setLoading(false); // ローディング完了
                        });
                    }
                });
            });
        }
        fetchPokeData();
    }

    return { FetchPokeData }
}