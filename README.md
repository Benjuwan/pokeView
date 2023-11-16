# pokeView
20231110-20231116

## 注意事項
デプロイ時は`useFetchPokeData.ts`と`useChangeBackGround.ts`で用意している`isDevMode`変数のbool値を変更（`false`）に切り替える。

## FixTo
データ取得の関数内（`useFetchPokeData.ts`）で一部の型が`any`のまま。

## 参照情報
[https://qiita.com/hato_code/items/e75f215ef2d5191341dc#](https://qiita.com/hato_code/items/e75f215ef2d5191341dc#)
- `assets`ディレクトリ内の`pokemon.json`は上記記事の執筆者の`GitHub`から拝借。