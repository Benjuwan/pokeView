# pokeView
制作期間：20231110 - 20231116

公開サイト：[https://pokeview-pi.vercel.app/](https://pokeview-pi.vercel.app/)

***

![pokeview-1](https://github.com/Benjuwan/pokeView/assets/90702379/414aafcd-6ef1-4590-81f5-2f0799c458c9)

***

![pokeview-2](https://github.com/Benjuwan/pokeView/assets/90702379/aff69e70-fc23-491e-816f-d6c492deb732)

## 注意事項
デプロイ時は`useChangeBackGround.ts`で用意している`isDevMode`変数のbool値を変更（`false`）に切り替える。

<details>
<summary>2023/11/24 修正：和訳ファイルを使用せずAPIデータから直後取得・反映</summary>

```
/* 和訳ファイルは一部翻訳されていなかったので APIデータから直後取得・反映させる仕様に変更。以下は変更前の内容。 */

import { ……, pokeNameLocalJsonFile } from "../ts/GetFetchDataType";

const isDevMode: boolean = true; // 開発・本番環境モードの切替用Bool

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

//...中略

const fetchPokeData = async () => {
    const FetchPokeName = await _FetchPokeName(); // 各ポケモンの英語・日本語名が格納されている配列

    //...中略

    // console.log(flavorTextAry); // 配列の index番号の違いで verごとの紹介文が取得できる。現状は[0]で初期verの紹介文

    /* ポケモン名を「英語名 → 日本語名」にする */
    _replacePokeName_enToja(FetchPokeName, pokeData);

    //...中略
}
```
</details>

## 参照情報
[https://qiita.com/hato_code/items/e75f215ef2d5191341dc#](https://qiita.com/hato_code/items/e75f215ef2d5191341dc#)
- `public/json`ディレクトリ内の`pokemon.json`は上記記事の執筆者の`GitHub`から拝借。

- 背景画像は「Bing Image Creator」を使用して生成。<br />
[商用利用不可なので注意](https://forest.watch.impress.co.jp/docs/serial/yajiuma/1543573.html)