/**
 * Created by paull on 25/1/2017.
 */


import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("InsightFacadeTest", function () {

    var insight: InsightFacade= null;

    beforeEach(function() {
        insight = new InsightFacade();
    })

    afterEach(function() {
        insight = null;
    })

   /* const fs = require('fs');
    it.only("addDataset should add a dataset to UBCInsight", function () {
        return insight.addDataset('courses',fs.readFile('courses.zip','base64')).then(function (value: InsightResponse) {
            var ir: InsightResponse;
            Log.test('Code: ' + value);
            expect(value.code).to.equal(204);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });*/




    //use fs.readfile to read the content here fs.readFile(id,function(err:Error, data:any) {};

});

