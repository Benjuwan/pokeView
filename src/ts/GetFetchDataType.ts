export type pokeAry = {
    name: string;
    url: string;
}

export type pokeFetchData = {
    count: number;
    next?: number | null;
    previous?: number | null;
    results: pokeAry[];
}


export type pokeLists = {
    id: number;
    name: string;
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
    type?: string;
    flavor_text?: {
        flavor_text: string;
        language: {
            name: string;
        };
    };
    species?: {
        url: string;
    };
}

export type pokeNameLocalJsonFile = {
    ja: string;
    en: string;
}