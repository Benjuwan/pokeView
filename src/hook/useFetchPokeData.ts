import { useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { pokeAry, pokeFetchData, pokeLists, pokeNameLocalJsonFile } from "../ts/GetFetchDataType";

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
                /* 置換処理に必要な文字列マッチングを行うために、それぞれ大文字にする */
                const UpperCase_jsonPokeName_en: string = pokeName.en.toUpperCase();
                const UpperCase_fetchPokeName: string = originName.name.toUpperCase();
                if (UpperCase_jsonPokeName_en.match(UpperCase_fetchPokeName)) {
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

                    if (pokeData.species !== undefined) {
                        fetch(pokeData.species.url).then(res => res.json()).then(speciesUrl => {
                            /* flavorTextAry：各ポケモンのシリーズごとの紹介文章を格納した配列（日本語データのみを取得している）*/
                            const flavorTextAry = speciesUrl.flavor_text_entries.filter((flavorText: {
                                flavor_text: string;
                                language: {
                                    name: string;
                                };
                            }) => {
                                /* 日本語データのみを取得 */
                                if (flavorText.language.name === 'ja') {
                                    return flavorText.flavor_text;
                                }
                            });

                            /* ポケモン名を「英語名 → 日本語名」にする */
                            _replacePokeName_enToja(FetchPokeName, pokeData);

                            /* 取得する各種データのオブジェクトとデータの反映 */
                            const newList: pokeLists = {
                                id: pokeData.id,
                                name: pokeData.name,
                                img: pokeData.sprites?.front_default,
                                officialImg: pokeData.sprites?.other["official-artwork"].front_default,
                                type: speciesUrl.genera[0].genus,
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