# pokeView
制作期間：20231110 - 20231116

公開サイト：[https://pokeview-pi.vercel.app/](https://pokeview-pi.vercel.app/)

## 注意事項
デプロイ時は`useFetchPokeData.ts`と`useChangeBackGround.ts`で用意している`isDevMode`変数のbool値を変更（`false`）に切り替える。

## FixTo
2023/11/22 修正（`any`型の値を代入した変数に型注釈）：~~データ取得の関数内（`useFetchPokeData.ts`）で一部の型が`any`のまま。~~

## 参照情報
[https://qiita.com/hato_code/items/e75f215ef2d5191341dc#](https://qiita.com/hato_code/items/e75f215ef2d5191341dc#)
- `public/json`ディレクトリ内の`pokemon.json`は上記記事の執筆者の`GitHub`から拝借。

- 背景画像は「Bing Image Creator」を使用して生成。<br />
[商用利用不可なので注意](https://forest.watch.impress.co.jp/docs/serial/yajiuma/1543573.html)