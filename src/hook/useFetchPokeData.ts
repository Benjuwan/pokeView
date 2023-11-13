import { useContext, useState } from "react";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { pokeAry, pokeFetchData, pokeLists, pokeNameLocalJsonFile } from "../ts/GetFetchDataType";

export const useFetchPokeData = () => {
    const { setPokeData, setPagerLimitMaxNum } = useContext(GetFetchDataContext);

    const [isPokeGenera, setPokeGenera] = useState<string[]>([]);
    const [isPokeFlavorText, setPokeFlavorText] = useState<string[]>([]);

    const FetchPokeData = () => {
        /* pokemon.json から各ポケモンの英語名と日本語名を取得 */
        const _FetchPokeName = async () => {
            const devModePath: string = `${location.origin}/src/assets/pokemon.json`; // 開発時
            const hostingModePath: string = `${location.origin}/assets/pokemon.json`; // 本番環境時
            const respone = await fetch(devModePath);
            const resObj: pokeNameLocalJsonFile[] = await respone.json();
            return resObj.map(resObjEl => resObjEl);
        }

        /* ポケモンデータを取得 */
        const fetchPokeData = async () => {
            const FetchPokeName = await _FetchPokeName(); // 各ポケモンの英語・日本語名が格納されている配列

            const respone = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
            const resObj: pokeFetchData = await respone.json();
            const resObjResult: pokeAry[] = resObj.results;
            setPagerLimitMaxNum((_prevPagerLimitMaxNum) => resObj.count); // 上限値の設定

            resObjResult.forEach(pokeDataSrc => {
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokeDataSrc.name}/`).then(res => res.json()).then((pokeData) => {

                    // fetch(pokeData.species.url).then(res => res.json()).then(speciesUrl => {
                    //   // console.log(speciesUrl.genera[0].genus);
                    //   setPokeGenera((_prevPokeGenera) => [...isPokeGenera, speciesUrl.genera[0].genus]);

                    //   const flavorTextAry = speciesUrl.flavor_text_entries.filter((flavorText: {
                    //     flavor_text: string;
                    //     language: {
                    //       name: string;
                    //     };
                    //   }) => {
                    //     if (flavorText.language.name === 'ja') {
                    //       // console.log(speciesUrl.genera[0].genus);
                    //       return flavorText.flavor_text;
                    //     }
                    //   });
                    //   // console.log(flavorTextAry);
                    //   setPokeFlavorText((_prevPokeFlavorText) => [...isPokeFlavorText, flavorTextAry]);
                    // });

                    /* ポケモン名を「英語名 → 日本語名」にする */
                    FetchPokeName.forEach(pokeName => {
                        /* ポケモン名を「英語名 → 日本語名」にする処理を行うために、それぞれ大文字にする */
                        const UpperCase_jsonPokeName_en: string = pokeName.en.toUpperCase();
                        const UpperCase_fetchPokeName: string = pokeData.name.toUpperCase();
                        if (UpperCase_jsonPokeName_en.match(UpperCase_fetchPokeName)) pokeData.name = pokeName.ja;
                    });

                    const newList: pokeLists = {
                        id: pokeData.id,
                        name: pokeData.name,
                        img: pokeData.sprites.front_default,
                        officialImg: pokeData.sprites.other["official-artwork"].front_default
                    }
                    setPokeData((_prevPokeData) => [..._prevPokeData, newList]);
                });
            });
        }
        fetchPokeData();
    }

    return { FetchPokeData }
}