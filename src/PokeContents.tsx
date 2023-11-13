import { memo, useState, useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import { pokeLists } from "./ts/GetFetchDataType";
import { GetFetchDataContext } from "./provider/GetFetchDataContext";
import { BtnComponent } from "./BtnComponent";
import { useViewImges } from "./hook/useViewImges";
import { usePager } from "./hook/usePager";
import { useFetchPokeData } from "./hook/useFetchPokeData";
import { Pagination } from "./Pagination";

export const PokeContents = memo(() => {
  /* 各種 Context */
  const { isPokeData, pagerLimitMaxNum, isPagers, isOffSet } = useContext(GetFetchDataContext);

  /* 各種 カスタムフック */
  const { FetchPokeData } = useFetchPokeData(); // コンテンツデータの取得機能
  const { ViewImges } = useViewImges(); // 画像のモーダル表示機能
  const { prevPagerPages, nextPagerPages } = usePager(); // ページャー機能

  /* ポケモンのデータを取得 */
  useEffect(() => FetchPokeData(), []);

  /* 最終ページの判定用 State（PokeContent の flexBox の調整で使用） */
  const [isFinalPage, setFinalPage] = useState<boolean>(false);

  /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための配列 State */
  const [isPagerContents, setPagerContents] = useState<pokeLists[]>([]);
  /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための処理 */
  const setPagerContentsFrag = useCallback((
    fragStart: number = isPagers,
    fragFinish: number = isOffSet
  ) => {
    const shallowCopy: pokeLists[] = [...isPokeData].sort((aheadElm, behindElm) => aheadElm.id - behindElm.id); // ポケモンの id 順にソート（StrictMode true では大体 id：60～70 番台までのポケモンが二重読込される）
    const splicedContents: pokeLists[] = shallowCopy.splice(fragStart, fragFinish);
    setPagerContents((_prevPagerContents) => splicedContents);
  }, [isPokeData, isPagers]); // 依存配列 コンテンツデータの取得時・ページャー変更時

  /* ページャー処理 */
  useEffect(() => {
    /* 最終ページの判定による State の切替 */
    if (pagerLimitMaxNum - isPagers <= isOffSet) setFinalPage(!isFinalPage);
    else setFinalPage(false);

    if (typeof pagerLimitMaxNum !== "undefined") {
      const limitBorderLine: number = pagerLimitMaxNum - isOffSet;
      if (isPagers >= limitBorderLine) {
        const remandNum: number = pagerLimitMaxNum - isPagers;
        setPagerContentsFrag(isPagers, remandNum);
      } else {
        setPagerContentsFrag();
      }
    }
    window.scrollTo(0, 0); // スクロールトップ
  }, [isPokeData, isPagers]); // 依存配列 コンテンツデータの取得時・ページャー変更時

  return (
    <PokeContent className={isFinalPage ? 'isFinalPage' : 'normal'}>
      <p id="pokeNum">{pagerLimitMaxNum} pokemons</p>
      {isPagerContents.map((pokeData, i) => (
        <div className="pokeContents" key={i}>
          <h2><span>{pokeData.id}</span>{pokeData.name}</h2>
          <div className="pokeImg" onClick={(imgElm: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            ViewImges(imgElm.currentTarget);
          }}>
            <img className="gameArt" src={pokeData.img} alt={pokeData.name} />
            <div className="officialArtwork">
              <img className="officialArt" src={pokeData.officialImg} alt={`${pokeData.name}のオフィシャル画像`} />
            </div>
          </div>
          {/* <p>{isPokeGenera[i]}</p> */}
          {/* <p>{isPokeFlavorText[i][0]}</p> */}
        </div>
      ))}
      {isPokeData.length > 0 &&
        <>
          <Pagination />
          <div className="ctrlBtns">
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
    </PokeContent>
  );
});

const PokeContent = styled.div`
padding: 1em;
display: flex;
flex-flow: row wrap;
gap: 5%;
width: clamp(240px, 100%, 800px);
margin: 0 auto;

@media screen and (min-width: 700px) {
  &.normal{
    justify-content: space-between;
    gap: 2.5%;
  }
  &.isFinalPage{
    justify-content: flex-start;
  }
}

  & #pokeNum{
    width: 100%;
    font-size: 12px;
    margin-bottom: 1em;
  }

  & .pokeContents{
    width: 45%;
    font-size: 1.4rem;
    text-align: center;
    /* https://neumorphism.io/#ffffff */
    box-shadow: inset 8px 8px 24px #e6e6e6, inset -8px -8px 24px #ffffff;
    padding: 1em;
    border-radius: 8px;
    margin-bottom: 5%;
    
    @media screen and (min-width: 700px) {
      font-size: 14px;
      width: clamp(80px, 100%, 120px);
    }

    & h2 {
      font-size: 1.6rem;
      font-weight: normal;
      text-align: center;

      & span {
        display: block;
        font-size: 1.2rem;
      }

    
      @media screen and (min-width: 700px) {
        font-size: 16px;

        & span {
          font-size: 12px;
        }
      }
    }

    & .pokeImg {
      & .gameArt {
        cursor: pointer;
        animation: charMov 1s infinite alternate-reverse;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);

        @keyframes charMov {
          0%{transform: scaleY(.85) translateY(4px)}
          100%{transform:scaleY(1) translateY(0px)}
        }
      }

      & .officialArtwork{
        position: fixed;
        margin: auto;
        inset: 0;
        display: grid;
        place-items: center;
        background-color: rgba(0, 0, 0, .75);
        opacity: 0;
        visibility: hidden;
        z-index: 1;

        & .officialArt{
          background-color: #fff;
          border-radius: 4px;
          width: clamp(160px, calc(100vw/2), 480px);
        }
      }

      &.OnView{
        & .officialArtwork{
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }

  & .ctrlBtns{
    display: flex;
    gap: 5%;
    width: 100%;
    margin: 0 auto 3em;
  }
`;