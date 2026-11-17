import { Context, Service } from 'cordis';
declare module 'cordis' {
    interface Context {
        ntWebApi: NTWebApi;
    }
}
export declare class NTWebApi extends Service {
    protected ctx: Context;
    static inject: string[];
    constructor(ctx: Context);
    genBkn(key: string): string;
    private cookieToString;
    getGroupHonorTalkative(groupCode: number, pSkey: string): Promise<{
        cgicode: number;
        retcode: number;
        msg: string;
        data: {
            current_talkative: {
                uin: number;
                day_count: number;
                avatar: string;
                avatar_size: number;
                nick: string;
            } | null;
            talkative_list: {
                uin: number;
                update_ymd: number;
                day_count: number;
                day_count_history: number;
                day_count_max: number;
                avatar: string;
                avatar_size: number;
                nick: string;
                honor_ids: number[];
                add_friend: number;
            }[];
            talkative_amount: number;
        };
    }>;
    getGroupHonorContinuous(groupCode: number, type: 2 | 3 | 5, pSkey: string): Promise<{
        cgicode: number;
        retcode: number;
        msg: string;
        data: {
            continuous_list: {
                uin: number;
                day_count: number;
                honor_ids: unknown[];
                avatar: string;
                avatar_size: number;
                nick: string;
                add_friend: number;
            }[];
            total: number;
        };
    }>;
    getGroupHonorEmotion(groupCode: number, pSkey: string): Promise<{
        cgicode: number;
        retcode: number;
        msg: string;
        data: {
            emotion_list: {
                uin: number;
                day_count: number;
                avatar: string;
                avatar_size: number;
                nick: string;
                add_friend: number;
            }[];
            total: number;
        };
    }>;
    batchDeleteGroupMember(groupCode: number, memberUinList: string[]): Promise<any>;
    getExpertInfo(uin: number): Promise<{
        ret: number;
        data: {
            m: number[];
            g: number[];
        };
        delay: number;
        domainid: number;
    }>;
    uploadGroupAlbum(groupCode: number, filePathList: string[], albumID: string): Promise<{
        success_count: number;
        fail_count: number;
        fail_indexes: number[];
    }>;
    publishGroupBulletin(groupCode: number, text: string, pinned: number, type: number, isShowEditCard: number, tipWindowType: number, confirmRequired: number, picId?: string, imgWidth?: number, imgHeight?: number): Promise<any>;
    getGroupBulletinList(groupCode: number): Promise<{
        ec: number;
        em: string;
        ltsm: number;
        srv_code: number;
        read_only: number;
        role: number;
        inst?: {
            u: number;
            fid: string;
            pubt: number;
            msg: {
                text: string;
                text_face: string;
                pics?: {
                    id: string;
                    w: string;
                    h: string;
                }[];
                title: string;
            };
            type: number;
            fn: number;
            cn: number;
            vn: number;
            settings: {
                is_show_edit_card: number;
                remind_ts: number;
                tip_window_type: number;
                confirm_required: number;
            };
            pinned: number;
            read_num: number;
            is_read: number;
            is_all_confirm: number;
        }[];
        feeds?: {
            u: number;
            fid: string;
            pubt: number;
            msg: {
                text: string;
                text_face: string;
                pics?: {
                    id: string;
                    w: string;
                    h: string;
                }[];
                title: string;
            };
            type: number;
            fn: number;
            cn: number;
            vn: number;
            settings: {
                is_show_edit_card: number;
                remind_ts: number;
                tip_window_type: number;
                confirm_required: number;
            };
            pinned: number;
            read_num: number;
            is_read: number;
            is_all_confirm: number;
        }[];
        group: {
            group_id: number;
            class_ext: number;
        };
        sta: number;
        gln: number;
        tst: number;
        ui: Record<string, {
            n: string;
            f: string;
        }>;
        server_time: number;
        svrt: number;
        next_index: unknown;
        jointime: number;
    }>;
    deleteGroupBulletin(groupCode: number, feedId: string): Promise<any>;
    getGroupBulletinUnread(groupCode: number, feedId: string, type: 0 | 1): Promise<{
        uin: number;
        avatar: string;
        face_flag: number;
        display_name: string;
    }[]>;
    getGroupEssenceList(groupCode: number, pageStart?: number, pageLimit?: number): Promise<{
        retcode: number;
        retmsg: string;
        data: {
            msg_list: {
                group_code: string;
                msg_seq: number;
                msg_random: number;
                sender_uin: string;
                sender_nick: string;
                sender_time: number;
                add_digest_uin: string;
                add_digest_nick: string;
                add_digest_time: number;
                msg_content: {
                    msg_type: number;
                    text?: string;
                    image_url?: string;
                    image_thumbnail_url?: string;
                }[];
                can_be_removed: boolean;
                disable_forward: boolean;
            }[];
            is_end: boolean;
            group_role: number;
            config_page_url: string;
        };
    }>;
    uploadGroupBulletinPic(groupCode: number, filePath: string): Promise<{
        errCode: any;
        errMsg: any;
        picInfo: {
            id: string;
            width: number;
            height: number;
        };
    }>;
    getDaySignedList(groupCode: number): Promise<{
        retCode: number;
        costTime: number;
        response: {
            ret?: {
                code: string;
                msg: string;
            };
            page?: {
                infos?: {
                    uid: string;
                    uidGroupNick: string;
                    signedTimeStamp: string;
                    signInRank: number;
                }[];
                offset: number;
                total: number;
            }[];
        };
        funcCode: number;
    }>;
    getCookies(domain: string): Promise<{
        [key: string]: string;
    }>;
}
