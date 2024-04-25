import { useContext } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { pokeAry, pokeFetchData, pokeLists, speciesItems } from "../ts/GetFetchDataType";

export const useFetchPokeData = () => {
    const { setPokeData, setPagerLimitMaxNum, setLoading } = useContext(GetFetchDataContext);

    const FetchPokeData: (url: string, signal: AbortSignal) => void = (
        url: string,
        signal: AbortSignal // AbortController から生成された AbortSignal のインスタンス
    ) => {
        setLoading(true); // ローディング開始

        /* ポケモンデータを取得 */
        const fetchPokeData: () => Promise<void> = async () => {
            try {
                const respone = await fetch(url, {
                    cache: "no-store",
                    signal: signal // fetch 関数の signal オプションに AbortController から生成された AbortSignal を渡すことで非同期処理をキャンセル
                });
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

                                /* タイプのデータ（speciesData.genera）が存在するポケモンのみタイプを反映 */
                                let pokeType: string | null = null;
                                if (speciesData.genera.length > 0) {
                                    pokeType = speciesData.genera[0].genus;
                                } else {
                                    // console.log(speciesData.names[0].name); // タイプのデータが無いポケモンたち
                                }

                                const jaPokeName = Object.values(speciesData.names).filter(namaDataItem => {
                                    if (namaDataItem.language.name === 'ja') {
                                        return namaDataItem.name;
                                    }
                                });

                                /* 取得する各種データのオブジェクトとデータの反映 */
                                const newList: pokeLists = {
                                    id: pokeData.id,
                                    name: jaPokeName[0].name,
                                    height: pokeData.height,
                                    weight: pokeData.weight,
                                    img: pokeData.sprites?.front_default,
                                    officialImg: pokeData.sprites?.other["official-artwork"].front_default,
                                    type: pokeType,
                                    flavor_text: flavorTextAry[0]
                                }
                                setPokeData((_prevPokeData) => [..._prevPokeData, newList]);

                                setLoading(false); // ローディング完了
                            });
                        }
                    });
                });
            } catch (err: unknown) {
                if (signal.reason.name === "AbortError") {
                    console.log('useEffect のクリーンアップ完了');
                    return;
                }
            }
        }
        fetchPokeData();
    }

    return { FetchPokeData }
}