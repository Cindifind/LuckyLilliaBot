import { ProtoMessage } from '@saltify/typeproto';
export declare namespace Misc {
    const UserInfoLabel: ProtoMessage<{
        readonly labels: import("@saltify/typeproto").ProtoSpec<{
            content: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, true>;
    }>;
    const UserInfoBusiness: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            msg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            lists: import("@saltify/typeproto").ProtoSpec<{
                type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                isYear: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                level: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                isPro: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                icon1: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                icon2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, true>;
        }, false, false>;
    }>;
}
