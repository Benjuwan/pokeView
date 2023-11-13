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
    img: string;
    officialImg: string;
    type?: string;
    flavor_text?: {
        flavor_text: string;
        language: {
            name: string;
        };
    };
}

export type pokeNameLocalJsonFile = {
    ja: string;
    en: string;
}