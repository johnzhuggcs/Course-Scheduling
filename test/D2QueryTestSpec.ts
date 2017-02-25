/**
 * Created by johnz on 2017-02-19.
 */
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade, FilterQuery, MCompare} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


describe("D2QueryTestSpec", function () {

    var insightFacade: InsightFacade = null;
    var insight: InsightFacade = null;
    var testInvalidKeys: string[] = [];
    var fs = require("fs")


    function sanityCheck(response: QueryRequest) {
        expect(response).to.have.property('WHERE');
        expect(response).to.have.property('OPTIONS');

        //expect(response.WHERE).to.be.a("FilterQuery");
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
        insightFacade = new InsightFacade();
        insight = new InsightFacade();
        return insight.addDataset('rooms', fs.readFileSync('rooms.zip').toString('base64'))
        //return insight.addDataset('courses', fs.readFileSync('courses.zip').toString('base64'))


    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        //insightFacade = new InsightFacade();
        //return insight.addDataset('courses',fs.readFileSync('courses.zip').toString('base64'))
        // return insightFacade.removeDataset('courses');

    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        insightFacade = null
        return insight.removeDataset('rooms');
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        //return insight.removeDataset('courses');


    });

    it("200 testing out simple query self", function () {

        var queryTest: any = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 180
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_seats",
                    "rooms_address"
                ],
                "ORDER": "rooms_address",
                "FORM": "TABLE"
            }
        }

        var result = {"render":"TABLE","result":[{"rooms_seats":181,"rooms_address":"1866 Main Mall"},{"rooms_seats":275,"rooms_address":"1866 Main Mall"},{"rooms_seats":224,"rooms_address":"1984 Mathematics Road"},{"rooms_seats":225,"rooms_address":"1984 West Mall"},{"rooms_seats":240,"rooms_address":"2036 Main Mall"},{"rooms_seats":265,"rooms_address":"2036 Main Mall"},{"rooms_seats":375,"rooms_address":"2045 East Mall"},{"rooms_seats":260,"rooms_address":"2053 Main Mall"},{"rooms_seats":280,"rooms_address":"2125 Main Mall"},{"rooms_seats":190,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":188,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":190,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":187,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":503,"rooms_address":"2194 Health Sciences Mall"},{"rooms_seats":181,"rooms_address":"2194 Health Sciences Mall"},{"rooms_seats":350,"rooms_address":"2207 Main Mall"},{"rooms_seats":426,"rooms_address":"2260 West Mall, V6T 1Z4"},{"rooms_seats":350,"rooms_address":"2350 Health Sciences Mall"},{"rooms_seats":350,"rooms_address":"2350 Health Sciences Mall"},{"rooms_seats":200,"rooms_address":"2357 Main Mall"},{"rooms_seats":200,"rooms_address":"2360 East Mall V6T 1Z3"},{"rooms_seats":236,"rooms_address":"2405 Wesbrook Mall"},{"rooms_seats":250,"rooms_address":"2424 Main Mall"},{"rooms_seats":299,"rooms_address":"6000 Student Union Blvd"},{"rooms_seats":299,"rooms_address":"6000 Student Union Blvd"},{"rooms_seats":299,"rooms_address":"6000 Student Union Blvd"},{"rooms_seats":442,"rooms_address":"6108 Thunderbird Boulevard"},{"rooms_seats":325,"rooms_address":"6174 University Boulevard"},{"rooms_seats":257,"rooms_address":"6224 Agricultural Road"},{"rooms_seats":228,"rooms_address":"6270 University Boulevard"},{"rooms_seats":205,"rooms_address":"6356 Agricultural Road"},{"rooms_seats":183,"rooms_address":"6356 Agricultural Road"}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });


    it("200 testing out NO ORDER simple query self", function () {

        var queryTest: any = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 180
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_seats",
                    "rooms_address"
                ],

                "FORM": "TABLE"
            }
        }

        var result = {"render":"TABLE","result":[{"rooms_seats":181,"rooms_address":"2194 Health Sciences Mall"},{"rooms_seats":503,"rooms_address":"2194 Health Sciences Mall"},{"rooms_seats":190,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":187,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":190,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":188,"rooms_address":"2175 West Mall V6T 1Z4"},{"rooms_seats":325,"rooms_address":"6174 University Boulevard"},{"rooms_seats":299,"rooms_address":"6000 Student Union Blvd"},{"rooms_seats":299,"rooms_address":"6000 Student Union Blvd"},{"rooms_seats":299,"rooms_address":"6000 Student Union Blvd"},{"rooms_seats":442,"rooms_address":"6108 Thunderbird Boulevard"},{"rooms_seats":236,"rooms_address":"2405 Wesbrook Mall"},{"rooms_seats":280,"rooms_address":"2125 Main Mall"},{"rooms_seats":224,"rooms_address":"1984 Mathematics Road"},{"rooms_seats":200,"rooms_address":"2357 Main Mall"},{"rooms_seats":350,"rooms_address":"2350 Health Sciences Mall"},{"rooms_seats":350,"rooms_address":"2350 Health Sciences Mall"},{"rooms_seats":205,"rooms_address":"6356 Agricultural Road"},{"rooms_seats":183,"rooms_address":"6356 Agricultural Road"},{"rooms_seats":260,"rooms_address":"2053 Main Mall"},{"rooms_seats":257,"rooms_address":"6224 Agricultural Road"},{"rooms_seats":375,"rooms_address":"2045 East Mall"},{"rooms_seats":225,"rooms_address":"1984 West Mall"},{"rooms_seats":250,"rooms_address":"2424 Main Mall"},{"rooms_seats":350,"rooms_address":"2207 Main Mall"},{"rooms_seats":265,"rooms_address":"2036 Main Mall"},{"rooms_seats":240,"rooms_address":"2036 Main Mall"},{"rooms_seats":200,"rooms_address":"2360 East Mall V6T 1Z3"},{"rooms_seats":426,"rooms_address":"2260 West Mall, V6T 1Z4"},{"rooms_seats":181,"rooms_address":"1866 Main Mall"},{"rooms_seats":275,"rooms_address":"1866 Main Mall"},{"rooms_seats":228,"rooms_address":"6270 University Boulevard"}]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it("200 testing out complex query provided in deliverable", function () {

        var queryTest: any = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "FORM": "TABLE"
            }
        }

        var result = {"render":"TABLE","result":[{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4074"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4068"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4058"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4018"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4004"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3074"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3068"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3058"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3018"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3004"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_1001"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4072"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4062"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4052"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4016"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4002"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3072"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3062"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3052"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3016"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3002"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_310"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_201"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_101"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_301"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_110"}]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it.only("200 testing out simple query YEARS", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "GT": {
                        "courses_year": 2015
                    }
                },
                    {
                        "EQ":{
                            "courses_avg":97
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result = {"render":"TABLE",
            "result":
                [{"courses_dept":"math","courses_year":2016,"courses_avg":97.25}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });

});