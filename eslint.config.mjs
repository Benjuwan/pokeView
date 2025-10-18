import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

/* ESLint設定 */
const eslintConfig = [
    /* 除外するファイル/ディレクトリを指定 */
    {
        ignores: [
            "node_modules/**",  // npmパッケージディレクトリ
            "build/**",         // ビルド成果物ディレクトリ
            "dist/**"           // 配布用ディレクトリ
        ]
    },

    /* ESLint総合設定 */
    {
        // TypeScriptとTSXファイルに対する設定
        files: ["**/*.ts", "**/*.tsx"],

        // languageOptions: パーサーやその詳細なオプション設定、グローバル変数の定義、サポートするECMAScriptのバージョンなどを設定するプロパティ
        languageOptions: {
            parser: typescriptParser,       // TypeScriptパーサーの設定
            parserOptions: {
                ecmaVersion: "latest",      // 最新のECMAScript機能をサポート
                sourceType: "module",       // ESモジュール形式を使用
                // より厳密な型チェック（型情報を必要とするルール）が必要な場合は以下を有効化
                // project: "./tsconfig.json",
                ecmaFeatures: {
                    jsx: true               // JSX構文のサポートを有効化
                }
            }
        },

        // 使用するプラグインの設定
        plugins: {
            "@typescript-eslint": typescript,   // TypeScript用のESLintプラグイン
            react,                              // React用のESLintプラグイン
            "react-hooks": reactHooks           // React Hooks用のESLintプラグイン
        },

        // プラグインやフレームワークの追加設定
        settings: {
            react: {
                version: "detect"  // Reactのバージョンを自動検出（警告メッセージを防ぐため）
            }
        },

        // 各種ルールの設定
        rules: {
            /* React ルール */
            // ...react.configs.recommended.rules, // Reactの推奨ルールセット（`no-unused-vars`など他の設定と競合するため一旦コメントアウトで無効）
            "react/jsx-uses-vars": "error",     // JSX内での変数の使用状況を追跡（未使用変数の誤検知を防ぐ）
            "react/prop-types": "off",          // PropTypesの検証を無効化（TypeScriptで型チェックするため不要）

            /* React Hooks ルール */
            "react-hooks/rules-of-hooks": "error",  // React Hooksのルールを厳格に適用（コンポーネントのトップレベルでのみ使用可能）
            "react-hooks/exhaustive-deps": "warn",  // useEffectなどの依存配列の検証（パフォーマンス最適化と副作用の適切な管理のため）

            /* TypeScript ルール */
            ...typescript.configs.recommended.rules,        // TypeScriptの推奨ルールセット
            "@typescript-eslint/no-explicit-any": "warn",  // any型の使用を警告（型安全性を維持するため）
            "@typescript-eslint/explicit-function-return-type": "off",  // 関数の戻り値型の明示を任意に設定（型推論で十分な場合が多いため）
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",  // アンダースコアで始まる引数は未使用でも警告しない（意図的な未使用を示す慣習）
                varsIgnorePattern: "^_"   // アンダースコアで始まる変数は未使用でも警告しない
            }],

            /* 一般的なコード品質ルール */
            "no-console": ["warn", {
                allow: ["warn", "error"]  // console.logは警告、console.warnとconsole.errorは許可（本番環境での不要なログ出力を防ぐ）
            }],
            "prefer-const": "warn"  // 再代入されない変数にはconstを推奨（意図しない再代入を防ぐ）
        }
    }
];

export default eslintConfig
