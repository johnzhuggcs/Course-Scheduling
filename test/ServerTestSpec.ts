/**
 * Created by johnz on 2017-02-06.
 */
import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("ServerTestSpec", function () {

    var insight: InsightFacade= null;
    var server:Server = null;
    beforeEach(function() {
        insight = new InsightFacade();
        server = new Server(4321);
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

    it("Should be able to start", function () {

        return server.start().then(function (value: boolean) {


            expect(value).to.equal(true);

        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err).to.equal(false);//should check the same name within the respairatory
        })

    });

    it("Should be able to stop", function () {

        return server.stop().then(function (value: boolean) {


            expect(value).to.equal(true);

        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err).to.deep.equal({});//should check the same name within the respairatory
        })

    });

    it("Should be able to echo", function () {

        return server.start().then(function (value: boolean) {


            expect(value).to.equal(true);

        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err).to.equal(false);//should check the same name within the respairatory
        })

    });

});