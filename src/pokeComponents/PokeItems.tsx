import { memo } from "react";
import { pokeLists } from "../ts/GetFetchDataType";
import { useViewImges } from "../hook/useViewImges";

export const PokeItems = memo(({ pokeData }: { pokeData: pokeLists }) => {
  const { ViewImges } = useViewImges(); // 画像のモーダル表示機能

  /* 重さ・高さの表記調整 */
  const adjustWeiHeight: (targetHeightNum: number) => string = (
    targetHeightNum: number
  ) => {
    const targetHeight: string = String(targetHeightNum);
    if (targetHeight.length === 1) {
      /* 1桁の場合は xxx.0 の形にして反転（0.xxx）させる */
      return String(targetHeightNum.toFixed(1)).split('').reverse().join('');
    } else {
      const shallowCopy: string[] = [...String(targetHeightNum)]; // 配列に変換する
      shallowCopy.splice(-1, 0, '.'); // 末尾の文字列の前に . を追加する
      return shallowCopy.join(''); // 文字列にして返す
    }
  }

  return (
    <div className="w-[45%] text-[0.75rem] text-center bg-white shadow-[inset_8px_8px_24px_#e6e6e6,_inset_-8px_-8px_24px_#ffffff] p-4 rounded-lg mb-[5%] md:text-[14px] md:w-full md:max-w-[120px]">
      <h2 className="text-[1rem] font-normal text-center md:text-[16px]">
        <span className="block text-[0.75rem] md:text-[14px]">{pokeData.id}</span>{pokeData.name}
      </h2>
      <div
        className="pokeImg"
        onClick={(imgElm: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          ViewImges(imgElm.currentTarget);
        }}
      >
        <img className="gameArt" src={pokeData.img} alt={pokeData.name} />
        <div className="officialArtwork fixed inset-0 m-auto grid place-content-center bg-black/75 opacity-0 invisible z-1">
          <img
            className="bg-white rounded-md w-[clamp(10rem,calc(100vw/1.4),30rem)] md:w-[clamp(160px,calc(100vw/1.4),400px)]"
            src={pokeData.officialImg}
            alt={`${pokeData.name}のオフィシャル画像`}
          />
          <div className="bg-white rounded w-[clamp(10rem,calc(100vw/1.4),30rem)] mt-4 p-4 text-left text-[0.75rem] leading-8 tracking-[0.25em] md:text-[14px] md:w-[clamp(160px,calc(100vw/1.4),400px)]">
            <p className="text-[1rem] font-bold md:text-[16px]">{pokeData.name}</p>
            {pokeData.type ?
              <p className="type">{pokeData.type}</p> :
              <p className="type">---今はまだ <a href="https://pokeapi.co/" target="_blank">「Pokémon API」</a> から「タイプ」のデータがありません。</p>
            }
            <div className="flex gap-[5%]">
              <p>高さ：{adjustWeiHeight(pokeData.height)}m</p>
              <p>重さ：{adjustWeiHeight(pokeData.weight)}kg</p>
            </div>
            {pokeData.flavor_text?.flavor_text ?
              <p className="border-t border-dotted border-[#737373] pt-1 mt-1">{pokeData.flavor_text?.flavor_text}</p> :
              <p className="border-t border-dotted border-[#737373] pt-1 mt-1">---今はまだ <a href="https://pokeapi.co/" target="_blank">「Pokémon API」</a> から「説明文」のデータがありません。</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
});
