import { memo, useState, useEffect, useContext } from "react";
import { pokeLists } from "../ts/GetFetchDataType";
import { GetFetchDataContext } from "../provider/GetFetchDataContext";
import { Pagination } from "./Pagination";
import { BtnComponent } from "./BtnComponent";
import { LoadingEl } from "./LoadingEl";
import { FilterPokeName } from "./FilterPokeName";
import { PokeItems } from "./PokeItems";
import { usePager } from "../hook/usePager";
import { useFetchPokeData } from "../hook/useFetchPokeData";

export const PokeContents = memo(() => {
  /* 各種 Context */
  const { isPokeData, pagerLimitMaxNum, isPagers, isOffSet, isLoading } = useContext(GetFetchDataContext);

  /* 各種 カスタムフック */
  const { FetchPokeData } = useFetchPokeData(); // コンテンツデータの取得機能
  const { prevPagerPages, nextPagerPages } = usePager(); // ページャー機能

  /* ポケモンのデータを取得 */
  useEffect(() => {
    const controller = new AbortController(); // AbortController ：非同期処理を中止するためのインターフェースを提供する Web API
    const signal = controller.signal; // controller から AbortSignal のインスタンスを取得して変数に代入

    /* ポケモンデータの fetch 処理 */
    FetchPokeData('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0', signal);

    /* useEffect のクリーンアップ処理 */
    return () => {
      controller.abort(); // AbortSignal に abort イベントが発生し、fetch に渡したsignal がこのイベントを検知して非同期処理をキャンセル（中止）
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 最終ページの判定用 State（PokeContent の flexBox の調整で使用） */
  const [isFinalPage, setFinalPage] = useState<boolean>(false);

  /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための配列 State */
  const [isPagerContents, setPagerContents] = useState<pokeLists[]>([]);
  /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための処理 */
  const setPagerContentsFrag: (
    fragStart?: number,
    fragFinish?: number
  ) => void = (
    fragStart: number = isPagers,
    fragFinish: number = isOffSet
  ) => {
      const shallowCopy: pokeLists[] = [...isPokeData].sort((aheadElm, behindElm) => aheadElm.id - behindElm.id); // ポケモンの id 順にソート（StrictMode true では大体 id：60～70 番台までのポケモンが二重読込される）
      const splicedContents: pokeLists[] = shallowCopy.splice(fragStart, fragFinish);
      setPagerContents(splicedContents);
    }

  /* ページャー処理 */
  useEffect(() => {
    /* 最終ページの判定による State の切替 */
    if (pagerLimitMaxNum - isPagers <= isOffSet) setFinalPage(!isFinalPage);
    else setFinalPage(false);

    /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための処理 */
    if (typeof pagerLimitMaxNum !== "undefined") {
      const limitBorderLine: number = pagerLimitMaxNum - isOffSet;
      if (isPagers >= limitBorderLine) {
        const remandNum: number = pagerLimitMaxNum - isPagers;
        setPagerContentsFrag(isPagers, remandNum); // remandNum：残りのコンテンツ数を全表示
      } else {
        setPagerContentsFrag();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPokeData, isPagers]); // 依存配列 コンテンツデータの取得時・ページャー変更時

  return (
    <>
      {isLoading ? <LoadingEl /> :
        <div className="PokeContent bg-no-repeat bg-cover relative z-1 overflow-x-hidden before:content-[''] before:w-screen before:h-full before:absolute before:z-[-1] before:m-auto before:inset-0 before:bg-gradient-to-t before:from-white/75 before:from-[88%] before:to-white before:to-[100%]">
          <div className={`p-4 md:p-4 flex flex-wrap gap-[5%] w-[clamp(240px,100%,800px)] mx-auto ${isFinalPage ? 'md:justify-start' : 'md:justify-between md:gap-[2.5%]'}`}>
            <p id="pokeNum" className="w-full text-xs mb-4">{pagerLimitMaxNum} pokemons</p>
            <FilterPokeName />
            {
              isPagerContents.map(pokeData => <PokeItems pokeData={pokeData} key={pokeData.id} />)
            }
            {isPokeData.length > 0 &&
              <>
                <Pagination />
                <div className="flex gap-[5%] w-full mx-auto mb-12">
                  <BtnComponent btnTxt="前のページ"
                    disabledBool={isPagers <= 0}
                    classNameTxt="Prev"
                    ClickEvent={prevPagerPages}
                  />
                  <BtnComponent btnTxt="次のページ"
                    disabledBool={isPagers >= (pagerLimitMaxNum - isOffSet)}
                    classNameTxt="Next"
                    ClickEvent={nextPagerPages}
                  />
                </div>
              </>
            }
          </div>
        </div>
      }
    </>
  );
});