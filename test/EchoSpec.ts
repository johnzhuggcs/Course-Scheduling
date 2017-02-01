/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("EchoSpec", function () {

    var insight: InsightFacade= null;

    beforeEach(function() {
        insight = new InsightFacade();
    })

    afterEach(function() {
        insight = null;
    })


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });



    const fs = require('fs');
    it("addDataset should add a dataset to UBCInsight", function () {
        Log.info("readFile:"+ fs.readFileSync('multi_courses.zip').toString('base64'));
        return insight.addDataset('NewInsight',fs.readFileSync('multi_courses.zip').toString('base64')).then(function (value: InsightResponse) {
            var ir: InsightResponse;
            Log.test('Code: ' + value);
            expect(value.code).to.equal(204);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })

    });

    it("addDataset should add a dataset to UBCInsight", function () {
        Log.info("readFile:"+ fs.readFileSync('multi_courses.zip').toString('base64'));
        fs.writeFile('VirtualInsight', '{}', (err: Error) => {
            if (err) throw err;
        });
        fs.writeFile('existingIds_Don\'tMakeAnotherIdOfThisFileName', 'VirtualInsight' + "\r\n", (err: Error) => {
            if (err) throw err;
        });
        return insight.addDataset('VirtualInsight',fs.readFileSync('multi_courses.zip').toString('base64')).then(function (value: InsightResponse) {
            var ir: InsightResponse;
            Log.test('Code: ' + value);
            expect(value.code).to.equal(201);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })

    });





    //use fs.readfile to read the content here fs.readFile(id,function(err:Error, data:any) {};

});
