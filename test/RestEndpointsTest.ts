/**
 * Created by paull on 6/3/2017.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("RestEndpointsTest.ts", function () {

    var insight: InsightFacade = null;
    var server = new Server(4321);

    before(function() {
        server.start();
    });

    after(function() {
        server.stop();
    });

    beforeEach(function () {
        insight = new InsightFacade();
    });

    afterEach(function () {
        insight = null;
    });

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    const fs = require('fs');
    var chai = require('chai')
       , chaiHttp = require('chai-http');

   chai.use(chaiHttp);

    //import {Response} from "restify";
    //import Response = chaiHttp.Response;



    it.only("PUT description", function () {
        return chai.request("http://localhost:4321")
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
            .then(function (res: any) {
                Log.trace('then:');
                //sanityCheck(res);
                //Log.test(JSON.stringify(value));
               // expect(res.code).to.equal(204);
                //Log.info(res.code);
                expect(res.body).to.deep.equal({});

                // some assertions
            })
            .catch(function (err: any) {
                Log.trace('catch:' + err);
                // some assertions
                expect.fail();
            });
    });

   /* it("POST description", function () {
        return chai.request(URL)
            .post('/dataset/rooms')
            .send(queryJSONObject)
            .then(function (res: any) {
                Log.trace('then:');
                // some assertions
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions
                expect.fail();
            });
    });
*/
});
