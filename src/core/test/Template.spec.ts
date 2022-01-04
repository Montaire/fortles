import assert from "assert";
import { InvalidTemplateError } from "../Error.js";
import { Template } from "../template/index.js";
import { StringCharacterStreamReader } from "../utility/index.js";
import { TestRenderEngine, TestRequest, TestResponse } from "./helper/index.js";

describe("Template", function(){
    describe("Shard", function(){
        describe("Anchor", function(){
            it("Anchor shard without go/do param is not valid", function(){
                let reader = new StringCharacterStreamReader("<a></a><e:a/>");
                assert.throws(() => new Template(reader, "test"), InvalidTemplateError);
                reader = new StringCharacterStreamReader("<e:a class='boo'>Hello<e:a/>");
                assert.throws(() => new Template(reader, "test"), InvalidTemplateError);
            })
            it("Anchor shard with go param", function(){
                let reader = new StringCharacterStreamReader("<a></a><e:a go='party' ></e:a>");
                let template = new Template(reader, "test");
                reader = new StringCharacterStreamReader('<a></a><e:a go="party" ></e:a>');
                template = new Template(reader, "test");
                //TestUtility.renderTemplate(template);
            })
        })
    })
});