import StringCharacterStreamReader from "../utility/StringCharacterStreamReader.js";
import { AnchorControlShard } from "../template/index.js";

describe("Check the template shards", function(){
    it("Check Anchor shard with no param", function(){
        let reader = new StringCharacterStreamReader("<a></a><e:a/>");
        let anchorShard = new AnchorControlShard(reader, null, true);
    })
});