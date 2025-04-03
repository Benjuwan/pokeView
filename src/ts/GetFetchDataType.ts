export type pokeAry = {
    name: string;
    url: string;
};

export type pokeFetchData = {
    count: number;
    next?: number | null;
    previous?: number | null;
    results: pokeAry[];
};

export type pokeLists = {
    id: number;
    name: string;
    height: number;
    weight: number;
    img: string | undefined;
    officialImg: string | undefined;
    sprites?: {
        front_default: string;
        other: {
            ["official-artwork"]: {
                front_default: string;
            };
        };
    };
    type?: string | null;
    flavor_text?: speciesItems;
    species?: {
        url: string;
    };
};

export type speciesItems = {
    genera: {
        length: number;
        [0]: {
            genus: string;
        }
    };
    names: {
        [0]: {
            language: {
                name: string
            },
            name: string
        }
    };
    flavor_text?: string; // データフェッチ処理後のオブジェクトの内容（求めている各ポケモンの紹介文情報）となる flavor_text
    flavor_text_entries: {
        filter(arg0: (flavorText: {
            flavor_text: string; // データフェッチ処理に必要な引数用の flavor_text
            language: {
                name: string;
            };
        }) => string | undefined): speciesItems[];
    };
};

export type pokeNameLocalJsonFile = {
    ja: string;
    en: string;
};