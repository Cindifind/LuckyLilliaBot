import { Media } from '../../ntqqapi/proto';
import { InferProtoModelInput } from '@saltify/typeproto';
import type { QQProtocolBase } from '../base';
import { ChatType } from '../../ntqqapi/types';
export declare function MediaMixin<T extends abstract new (...args: any[]) => QQProtocolBase>(Base: T): T & (abstract new (...args: any[]) => MediaMixinMethods);
/** Public methods contributed by this protocol mixin. */
export interface MediaMixinMethods {
    getRKey(): Promise<{
        readonly result: {
            rkeyItems: {
                rkey: string;
                ttlSec: number;
                storeId: number;
                createTime: number;
                type: number;
            }[];
        };
    }>;
    getPrivatePttUrl(fileUuid: string): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getGroupPttUrl(fileUuid: string): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getGroupVideoUrl(fileUuid: string): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getPrivateVideoUrl(fileUuid: string): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getGroupImageDownloadUrl(groupCode: string, info: InferProtoModelInput<typeof Media.FileInfo>, fileUuid?: string): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getC2CImageDownloadUrl(peerUid: string, info: InferProtoModelInput<typeof Media.FileInfo>, fileUuid?: string): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getHighwaySession(): Promise<{
        highwayHostAndPorts: Record<number, string[]>;
        sigSession: Buffer<ArrayBufferLike>;
    }>;
    notifyGroupVideoUploadCompleted(groupCode: string, msgInfoBytes: Buffer, clientRandomId: number): Promise<{
        readonly upload: {
            uKey: string | undefined;
            uKeyTtlSecond: number;
            ipv4s: {
                readonly outIP: number;
                readonly outPort: number;
                readonly inIP: number;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            ipv6s: {
                readonly outIP: Buffer<ArrayBufferLike>;
                readonly outPort: number;
                readonly inIP: Buffer<ArrayBufferLike>;
                readonly inPort: number;
                readonly ipType: number;
            }[];
            msgSeq: number | undefined;
            msgInfo: Buffer<ArrayBufferLike>;
            ext: {
                subType: number;
                extType: number;
                extValue: Buffer<ArrayBufferLike>;
            }[];
            compatQMsg: Buffer<ArrayBufferLike>;
            subFileInfos: {
                subType: number;
                uKey: string | undefined;
                uKeyTtlSecond: number;
                ipv4s: {
                    readonly outIP: number;
                    readonly outPort: number;
                    readonly inIP: number;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
                ipv6s: {
                    readonly outIP: Buffer<ArrayBufferLike>;
                    readonly outPort: number;
                    readonly inIP: Buffer<ArrayBufferLike>;
                    readonly inPort: number;
                    readonly ipType: number;
                }[];
            }[];
        } | undefined;
        readonly download: {
            rKeyParam: string;
            rKeyTtlSecond: number;
            info: {
                domain: string;
                urlPath: string;
                httpsPort: number;
            };
            rKeyCreateTime: number;
        } | undefined;
    }>;
    getGroupVideoUploadInfo(groupCode: string, filePath: string, thumbFilePath: string, duration: number, width: number, height: number): Promise<{
        info: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
        ext: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
        subExt: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
    }>;
    getC2CVideoUploadInfo(chatType: ChatType, peerUid: string, filePath: string, thumbFilePath: string, duration: number, width: number, height: number): Promise<{
        info: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
        ext: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
        subExt: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
    }>;
    getGroupFileUploadInfo(groupCode: number, filePath: string, fileName: string, parentFolderId: string, busId: number): Promise<{
        fileSize: number;
        md5: NonSharedBuffer;
        retCode: bigint;
        retMsg: string;
        clientWording: string;
        uploadIp: string;
        serverDns: string;
        busId: number;
        fileId: string;
        checkKey: Buffer<ArrayBufferLike>;
        fileKey: Buffer<ArrayBufferLike>;
        fileExist: boolean;
        uploadIpLanV4: string[];
        uploadIpLanV6: string[];
        uploadPort: number;
    }>;
    getC2CFileUploadInfo(chatType: ChatType, peerUid: string, filePath: string, fileName: string): Promise<{
        isExist: boolean;
        fileId: string;
        uploadKey: Buffer<ArrayBufferLike>;
        rtpMediaPlatformUploadAddress: [string, number][];
        crcMedia: string;
        fileSize: number;
        md510MCheckSum: NonSharedBuffer;
        sha1CheckSum: NonSharedBuffer;
        md5CheckSum: NonSharedBuffer;
        sha3CheckSum: NonSharedBuffer;
    }>;
    getGroupImageUploadInfo(groupCode: string, filePath: string, width: number, height: number, summary: string, bizType: number): Promise<{
        info: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
        ext: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
    }>;
    getC2CImageUploadInfo(chatType: ChatType, peerUid: string, filePath: string, width: number, height: number, summary: string, bizType: number): Promise<{
        info: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
        ext: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
    }>;
    getGroupPttUploadInfo(groupCode: string, filePath: string, duration: number): Promise<{
        info: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
        ext: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
    }>;
    getC2CPttUploadInfo(chatType: ChatType, peerUid: string, filePath: string, duration: number): Promise<{
        info: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
        ext: {
            fileUuid: string;
            uKey: string | undefined;
            network: {
                ipv4s: {
                    domain: {
                        isEnable: true;
                        ip: string;
                    };
                    port: number;
                }[];
            };
            msgInfoBody: {
                readonly index: {
                    readonly info: {
                        readonly fileSize: number;
                        readonly md5HexStr: string;
                        readonly sha1HexStr: string;
                        readonly fileName: string;
                        readonly fileType: {
                            type: number;
                            picFormat: number;
                            videoFormat: number;
                            pttFormat: number;
                        };
                        readonly width: number;
                        readonly height: number;
                        readonly time: number;
                        readonly original: number;
                    };
                    readonly fileUuid: string;
                    readonly storeID: number;
                    readonly uploadTime: number;
                    readonly expire: number;
                    readonly type: number;
                };
                readonly pic: {
                    urlPath: string;
                    ext: {
                        originalParam: string;
                        bigParam: string;
                        thumbParam: string;
                    };
                    domain: string;
                } | undefined;
                readonly video: Buffer<ArrayBufferLike> | undefined;
                readonly audio: Buffer<ArrayBufferLike> | undefined;
                readonly fileExist: boolean;
                readonly hashSum: {
                    bytesPbReserveC2c: {
                        friendUid: string;
                    } | undefined;
                    troopSource: {
                        groupCode: number;
                    } | undefined;
                };
            }[];
            blockSize: number;
            hash: {
                fileSha1: Buffer<ArrayBufferLike>[];
            };
        };
    }>;
    imageOcr(imageUrl: string): Promise<{
        readonly retCode: number | undefined;
        readonly errMsg: string;
        readonly wording: string | undefined;
        readonly ocrRspBody: {
            textDetections: {
                detectedText: string;
                confidence: number;
                polygon: {
                    coordinates: {
                        x: number;
                        y: number;
                    }[];
                };
                advancedInfo: string;
            }[];
            language: string;
            requestId: string;
            ocrLanguageList: string[];
            dstTranslateLanguageList: string[];
            languageList: {
                languageCode: string;
                languageDesc: string;
            }[];
            afterCompressWeight: number;
            afterCompressHeight: number;
        };
    }>;
    getFlashFileSetIdByCode(code: string): Promise<string>;
    getFlashFileInfo(fileSetId: string): Promise<{
        fileSetId: string;
        title: string;
        subtitle: string;
        field4: number;
        totalSize: number;
        shareInfo: {
            readonly url: string;
        } | undefined;
        field11: number;
        createTime: number;
        expireTime: number;
    } | undefined>;
    getFlashFileList(fileSetId: string): Promise<{
        readonly fileSetId: string;
        readonly fileUuid: string;
        readonly field5: number;
        readonly field6: number;
        readonly fileTypeFlag: number;
        readonly name: string;
        readonly name2: string;
        readonly fileSize: number;
        readonly downloadToken: {
            token: string;
            tokenWithKind: {
                kind: number;
                token: string;
            };
            sha1Hex: string;
            field4: number;
            md5Hex: string;
            field6: number;
            field7: number;
        } | undefined;
        readonly historyToken: {
            token: string;
            field3: number;
        } | undefined;
        readonly fileUuid2: string;
        readonly field18: number;
        readonly sha1Hex: string;
        readonly fileSize2: number;
        readonly md5Hex: string;
    }[]>;
    getFlashFileEntryFull(fileSetId: string, fileUuid: string): Promise<{
        readonly fileSetId: string;
        readonly fileUuid: string;
        readonly field5: number;
        readonly field6: number;
        readonly fileTypeFlag: number;
        readonly name: string;
        readonly name2: string;
        readonly fileSize: number;
        readonly downloadToken: {
            token: string;
            tokenWithKind: {
                kind: number;
                token: string;
            };
            sha1Hex: string;
            field4: number;
            md5Hex: string;
            field6: number;
            field7: number;
        } | undefined;
        readonly historyToken: {
            token: string;
            field3: number;
        } | undefined;
        readonly fileUuid2: string;
        readonly field18: number;
        readonly sha1Hex: string;
        readonly fileSize2: number;
        readonly md5Hex: string;
    } | undefined>;
    downloadFlashFile(fileSetId: string, sceneType?: number): Promise<{
        result: number;
    }>;
    createFlashFileSet(opts: {
        title: string;
        subtitle?: string;
        totalFileCount: number;
        totalFileSize: number;
        uploaderUin: string;
        uploaderNick: string;
        uploaderUid: string;
        scene?: number;
    }): Promise<{
        readonly fileSetId: string;
        readonly fileSetIdEcho: string;
        readonly shareLink: string;
        readonly expireTime: number;
        readonly expireLeftTime: number;
    }>;
    registerFlashFile(fileSetId: string, file: {
        fileUuid: string;
        name: string;
        fileSize: number;
        sha1Hex?: string;
        md5Hex?: string;
    }): Promise<{
        result: number;
    }>;
    prepFlashFileSet(fileSetId: string): Promise<{
        result: number;
    }>;
    flashFileUploadPreflight(opts: {
        fileSize: number;
        sha1Hex: string;
        name: string;
        requestId: number;
        field103?: number;
    }): Promise<{
        retCode: string;
        uKey: string;
        token: string;
        time: number;
        ttl: number;
    }>;
    flashFileUploadCommit(opts: {
        fileSize: number;
        sha1Hex: string;
        name: string;
        token: string;
        time: number;
        ttl: number;
        requestId: number;
        fileSetId: string;
        fileUuid: string;
        field103?: number;
        fileTypeFlag?: number;
    }): Promise<{
        result: number;
    }>;
    flashFileDownloadUrl(opts: {
        fileSetId: string;
        fileUuid: string;
        fileName: string;
        fileSha1?: Buffer;
        fileMd5?: Buffer;
        fileSize?: number;
        fileId?: string;
        fileTypeFlag?: number;
        requestId: number;
    }): Promise<{
        host: string;
        path: string;
        port: number;
        rkey: string;
        ttl: number;
        fullUrl: string;
    }>;
}
