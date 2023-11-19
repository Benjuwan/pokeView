import { FC, memo } from "react";
import styled from "styled-components";
import { pokeLists } from "../ts/GetFetchDataType";
import { useViewImges } from "../hook/useViewImges";

type pokeItemsType = {
  pokeData: pokeLists,
  index: number
}

/* 高さの表記調整 */
const adjustHeight = (
  targetHeightNum: number
) => {
  const targetHeight: string = String(targetHeightNum);
  if (targetHeight.length === 1) {
    /* 1桁の場合は xxx.0 の形にして反転（0.xxx）させる */
    return String(targetHeightNum.toFixed(1)).split('').reverse().join('');
  } else {
    return targetHeight.split('').join('.');
  }
}

/* 重さの表記調整 */
const adjustWeight = (
  targetWeightNum: number
) => {
  const targetHeight: string = String(targetWeightNum);
  if (targetHeight.length === 1) {
    /* 1桁の場合は xxx.0 の形にして反転（0.xxx）させる */
    return String(targetWeightNum.toFixed(1)).split('').reverse().join('');
  } else {
    const shallowCopy: string[] = [...String(targetWeightNum)]; // 配列に変換する
    shallowCopy.splice(-1, 0, '.'); // 末尾の文字列の前に . を追加する
    return shallowCopy.join(''); // 文字列にして返す
  }
}

export const PokeItems: FC<pokeItemsType> = memo(({ pokeData, index }) => {
  const { ViewImges } = useViewImges(); // 画像のモーダル表示機能

  return (
    <PokeContents className="pokeContents" key={index}>
      <h2><span>{pokeData.id}</span>{pokeData.name}</h2>
      <div className="pokeImg" onClick={(imgElm: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        ViewImges(imgElm.currentTarget);
      }}>
        <img className="gameArt" src={pokeData.img} alt={pokeData.name} />
        <div className="officialArtwork">
          <img className="officialArt" src={pokeData.officialImg} alt={`${pokeData.name}のオフィシャル画像`} />
          <div className="details">
            <p className="name">{pokeData.name}</p>
            <p className="type">{pokeData.type}</p>
            <div className="weiheight">
              <p>高さ：{adjustHeight(pokeData.height)}m</p>
              <p>重さ：{adjustWeight(pokeData.weight)}kg</p>
            </div>
            <p className="flavorText">{pokeData.flavor_text?.flavor_text}</p>
          </div>
        </div>
      </div>
    </PokeContents>
  );
});

const PokeContents = styled.div`
width: 45%;
font-size: 1.4rem;
text-align: center;
background-color: #fff;
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
        place-content: center;
        background-color: rgba(0, 0, 0, .75);
        opacity: 0;
        visibility: hidden;
        z-index: 1;

        & .officialArt,
        & .details{
          background-color: #fff;
          border-radius: 4px;
          width: clamp(160px, calc(100vw/1.4), 480px);
        }
        
        & .details{
          margin-top: 1em;
          padding: 1em;
          text-align: left;
          font-size: 1.4rem;
          line-height: 2;
          letter-spacing: 0.25em;
          
          & .name{
            font-size: 1.6rem;
            font-weight: bold;
          }

          & .weiheight{
            display: flex;
            gap: 5%;
          }

          & .flavorText{
            border-top: 1px dotted #737373;
            padding-top: .25em;
            margin-top: .25em;
          }

          @media screen and (min-width: 700px) {
            font-size: 14px;

            & .name{
              font-size: 16px;
            }
          }
        }
      }

      &.OnView{
        & .officialArtwork{
          opacity: 1;
          visibility: visible;
          overflow-y: scroll;
          overscroll-behavior: contain;
        }
      }
    }
`;