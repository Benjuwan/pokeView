# pokeView
20231110-20231113

## 注意事項
デプロイ時は`useFetchPokeData.ts`カスタムフックで記述している`_FetchPokeName`メソッド（pokemon.json から各ポケモンの英語名と日本語名を取得するメソッド）のデータ取得元パスの調整を忘れないように。
- 開発時：`... fetch(devModePath);`
- 本番環境時：`... fetch(hostingModePath);`

## 参照情報
[https://qiita.com/hato_code/items/e75f215ef2d5191341dc#](https://qiita.com/hato_code/items/e75f215ef2d5191341dc#)
- `assets`ディレクトリ内の`pokemon.json`は上記記事の執筆者の`GitHub`から拝借。