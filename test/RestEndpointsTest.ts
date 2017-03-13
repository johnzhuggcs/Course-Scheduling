/**
 * Created by paull on 6/3/2017.
 */

import
    Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade, QueryRequest} from "../src/controller/IInsightFacade";
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

    it("PUT description (204)", function () {
        return chai.request("http://localhost:4321")
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
            .then(function (res: any) {
                expect(res.status).to.equal(204);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });
    it("PUT description (201)", function () {
        return chai.request("http://localhost:4321")
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
            .then(function (res: any) {
                expect(res.status).to.equal(201);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });
    it("PUT description (400)", function () {
        return chai.request("http://localhost:4321")
            .put('/dataset/failedFile')
            .attach("body", fs.readFileSync("./empty_zip.zip"), "empty_zip.zip")
            .then(function (res: any) {
                expect.fail();
            })
            .catch(function (err: any) {
                expect(err.status).to.equal(400);
            });
    });

    it("POST description (200)", function () {
        var queryJSONObject:QueryRequest = {
            "WHERE":{
                "GT":{
                    'courses_avg':97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };

        return chai.request("http://localhost:4321")
            .post('/query')
            .send(queryJSONObject)
            .then(function (res: any) {
                Log.trace('then:');
                expect(res.status).to.equal(200);
            })
            .catch(function (err:any) {
                Log.info(err);
                Log.trace('catch:');
                expect.fail();
            });
    });

    it("POST description (400)", function () {
        var queryJSONObject:QueryRequest = {
            "WHERE":
                {"NOT":{"NOT":{"NOT":
                    {
                        "LT":{
                            "courses_avg":99

                        }}}}

                },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"rooms_avg",
                "FORM":"TABLE"
            }
        }

        return chai.request("http://localhost:4321")
            .post('/query')
            .send(queryJSONObject)
            .then(function (res: any) {
                Log.trace('then:');
                expect(res.status).to.equal(400);
            })
            .catch(function (err:any) {
                Log.info(err);
                Log.trace('catch:');
                expect(err.status).to.equal(400);
            });
    });

    it("POST description (424)", function () {
        var queryJSONObject:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "fake_avg":90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT":{
                                    "AND":[
                                        {
                                            "GT":{
                                                "sham_avg":"90"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "fake_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "fake_dept",
                    "fake_id",
                    "fake_avg"
                ],
                "ORDER":"fake_avg",
                "FORM":"TABLE"
            }
        };

        return chai.request("http://localhost:4321")
            .post('/query')
            .send(queryJSONObject)
            .then(function (res: any) {
                Log.trace('then:');
                expect(res.status).to.equal(424);
            })
            .catch(function (err:any) {
                Log.info(err);
                Log.trace('catch:');
                expect(err.status).to.equal(424);
            });
    });

    it("DELETE description (204)", function () {
        return chai.request("http://localhost:4321")
            .del('/dataset/courses')
            .then(function (res: any) {
                expect(res.status).to.equal(204);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });
    it("DELETE description (404)", function () {
        return chai.request("http://localhost:4321")
            .del('/dataset/courses')
            .then(function (res: any) {
                expect.fail();
            })
            .catch(function (err: any) {
                expect(err.status).to.equal(404);
            });
    });

});
