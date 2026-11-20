export type MusicPlatform = 'qq' | '163' | 'kugou' | 'kuwo' | 'migu';
export interface IdMusicCardData {
    type: MusicPlatform;
    id: string | number;
}
export interface CustomMusicCardData {
    type: MusicPlatform | 'custom';
    /** Jump URL */
    url: string;
    audio: string;
    title: string;
    content?: string;
    image?: string;
    singer?: string;
    /** Which platform a custom card shows as; QQ Music when left out. */
    subtype?: MusicPlatform;
}
export type MusicCardData = IdMusicCardData | CustomMusicCardData;
/**
 * An unsigned music card (ark). Core.sendMessage has it signed with every other card; the sign service reads
 * meta.music and extra.appid (docs/card-message-sign.md).
 */
export declare function buildMusicCard(data: MusicCardData): Promise<string>;
/**
 * A signed music card from a music card service such as ss.xingzhige.com: song parameters in, the signed card out.
 * That service no longer looks QQ Music ids up, so those are looked up here and sent the custom way.
 */
export declare function requestMusicCard(url: string, data: MusicCardData): Promise<string>;
