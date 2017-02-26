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

        return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
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
        return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
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

        var result = {"render":"TABLE","result":[
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4074"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4068"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4058"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4018"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4004"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3074"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3068"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3058"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3018"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3004"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_1001"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4072"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4062"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4052"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4016"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4002"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3072"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3062"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3052"},
            {"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3016"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3002"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_310"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_201"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_101"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_301"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_110"}]}
        return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            //expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it("200 testing out complex query provided in deliverable", function () {

        var queryTest: any = {
            "WHERE": {
                "AND":[{
                    "IS": {
                        "rooms_address": "*Agrono*"
                    }
                },
                    {
                        "GT":{
                            "rooms_seats":100
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "FORM": "TABLE"
            }
        }

        var result:any = {"render":"TABLE","result":[{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_310"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_110"}]}
        return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            /**for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }*/
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            //expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it("200 TYPE testing out group type without some furniture", function () {

        var queryTest: any = {
            "WHERE": {
                "AND":[{
                    "IS": {
                        "rooms_type": "*Group*"
                    }
                },
                    {
                        "NOT": {
                            "IS": {
                                "rooms_furniture": "Classroom-Movable Tables & Chairs"
                            }
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type"
                ],
                "ORDER": "rooms_type",
                "FORM": "TABLE"
            }
        }

        var result:any =
            {"render":"TABLE","result":[{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Small Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"},{"rooms_type":"Tiered Large Group"}]}
            return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"];
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                    expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it("200 TYPE FURNITURE testing out group type without some furniture", function () {

        var queryTest: any = {
            "WHERE": {
                "AND":[{
                    "IS": {
                        "rooms_type": "*Group*"
                    }
                },
                    {
                        "NOT": {
                            "IS": {
                                "rooms_furniture": "Classroom-Movable Tables & Chairs"
                            }
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type", "rooms_furniture"
                ],
                "ORDER": "rooms_type",
                "FORM": "TABLE"
            }
        }

        var result:any =
            {"render":"TABLE","result":[{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tablets"},{"rooms_type":"Small Group","rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"}]}

            return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            //expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it("200 ADDRESS NAME TYPE testing out group type without some furniture", function () {

        var queryTest: any = {
            "WHERE": {
                "AND":[{
                    "IS": {
                        "rooms_type": "*Group*"
                    }
                },
                    {
                        "NOT": {
                            "IS": {
                                "rooms_furniture": "Classroom-Movable Tables & Chairs"
                            }
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name", "rooms_type"
                ],
                "ORDER": "rooms_type",
                "FORM": "TABLE"
            }
        }

        var result:any =
            {"render":"TABLE","result":[{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_193","rooms_type":"Small Group"},{"rooms_address":"6303 North West Marine Drive","rooms_name":"ANSO_203","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_408","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_406","rooms_type":"Small Group"},{"rooms_address":"2206 East Mall","rooms_name":"SPPH_143","rooms_type":"Small Group"},{"rooms_address":"2206 East Mall","rooms_name":"SPPH_B108","rooms_type":"Small Group"},{"rooms_address":"6108 Thunderbird Boulevard","rooms_name":"OSBO_203B","rooms_type":"Small Group"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1008","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_203","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_201","rooms_type":"Small Group"},{"rooms_address":"1984 Mathematics Road","rooms_name":"MATH_202","rooms_type":"Small Group"},{"rooms_address":"1984 Mathematics Road","rooms_name":"MATH_225","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360K","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360H","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360F","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360D","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360B","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360L","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360J","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360G","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360E","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360C","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360A","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_263","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_B79","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_461","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_266","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_194","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_192","rooms_type":"Small Group"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_214","rooms_type":"Small Group"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_242","rooms_type":"Small Group"},{"rooms_address":"2205 East Mall","rooms_name":"FNH_320","rooms_type":"Small Group"},{"rooms_address":"2205 East Mall","rooms_name":"FNH_20","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D313","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D307","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D304","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B307","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B304","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B302","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D306","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D228","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D216","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D213","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B319","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B310","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B308","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B306","rooms_type":"Small Group"},{"rooms_address":"6303 North West Marine Drive","rooms_name":"ANSO_205","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_1","rooms_type":"Tiered Large Group"},{"rooms_address":"1986 Mathematics Road","rooms_name":"MATX_1100","rooms_type":"Tiered Large Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_182","rooms_type":"Tiered Large Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_5","rooms_type":"Tiered Large Group"},{"rooms_address":"1984 Mathematics Road","rooms_name":"MATH_100","rooms_type":"Tiered Large Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_222","rooms_type":"Tiered Large Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_122","rooms_type":"Tiered Large Group"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_310","rooms_type":"Tiered Large Group"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_301","rooms_type":"Tiered Large Group"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_110","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_350","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_345","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_243","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_098","rooms_type":"Tiered Large Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_3","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_347","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_343","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_241","rooms_type":"Tiered Large Group"},{"rooms_address":"6224 Agricultural Road","rooms_name":"HENN_202","rooms_type":"Tiered Large Group"},{"rooms_address":"6224 Agricultural Road","rooms_name":"HENN_200","rooms_type":"Tiered Large Group"},{"rooms_address":"6224 Agricultural Road","rooms_name":"HENN_201","rooms_type":"Tiered Large Group"},{"rooms_address":"2045 East Mall","rooms_name":"HEBB_100","rooms_type":"Tiered Large Group"},{"rooms_address":"6174 University Boulevard","rooms_name":"WESB_100","rooms_type":"Tiered Large Group"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_100","rooms_type":"Tiered Large Group"},{"rooms_address":"6174 University Boulevard","rooms_name":"WESB_201","rooms_type":"Tiered Large Group"},{"rooms_address":"2177 Wesbrook Mall V6T 1Z3","rooms_name":"FRDM_153","rooms_type":"Tiered Large Group"},{"rooms_address":"6333 Memorial Road","rooms_name":"LASR_102","rooms_type":"Tiered Large Group"},{"rooms_address":"6333 Memorial Road","rooms_name":"LASR_104","rooms_type":"Tiered Large Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1221","rooms_type":"Tiered Large Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1005","rooms_type":"Tiered Large Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_6","rooms_type":"Tiered Large Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_4","rooms_type":"Tiered Large Group"},{"rooms_address":"2205 East Mall","rooms_name":"FNH_60","rooms_type":"Tiered Large Group"},{"rooms_address":"2207 Main Mall","rooms_name":"ESB_2012","rooms_type":"Tiered Large Group"},{"rooms_address":"2207 Main Mall","rooms_name":"ESB_1012","rooms_type":"Tiered Large Group"},{"rooms_address":"2207 Main Mall","rooms_name":"ESB_1013","rooms_type":"Tiered Large Group"},{"rooms_address":"6250 Applied Science Lane","rooms_name":"CEME_1202","rooms_type":"Tiered Large Group"},{"rooms_address":"2036 Main Mall","rooms_name":"CHEM_D200","rooms_type":"Tiered Large Group"},{"rooms_address":"2036 Main Mall","rooms_name":"CHEM_C124","rooms_type":"Tiered Large Group"},{"rooms_address":"2036 Main Mall","rooms_name":"CHEM_B150","rooms_type":"Tiered Large Group"},{"rooms_address":"2036 Main Mall","rooms_name":"CHEM_D300","rooms_type":"Tiered Large Group"},{"rooms_address":"2036 Main Mall","rooms_name":"CHEM_C126","rooms_type":"Tiered Large Group"},{"rooms_address":"2036 Main Mall","rooms_name":"CHEM_B250","rooms_type":"Tiered Large Group"},{"rooms_address":"2360 East Mall V6T 1Z3","rooms_name":"CHBE_101","rooms_type":"Tiered Large Group"},{"rooms_address":"2360 East Mall V6T 1Z3","rooms_name":"CHBE_102","rooms_type":"Tiered Large Group"},{"rooms_address":"2260 West Mall, V6T 1Z4","rooms_name":"CIRS_1250","rooms_type":"Tiered Large Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_2","rooms_type":"Tiered Large Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_221","rooms_type":"Tiered Large Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_1101","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D219","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D217","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B315","rooms_type":"Tiered Large Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_1201","rooms_type":"Tiered Large Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_100","rooms_type":"Tiered Large Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_121","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_A201","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_A103","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_A101","rooms_type":"Tiered Large Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_166","rooms_type":"Tiered Large Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_158","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D218","rooms_type":"Tiered Large Group"},{"rooms_address":"2356 Main Mall","rooms_name":"MCLD_202","rooms_type":"Tiered Large Group"},{"rooms_address":"2356 Main Mall","rooms_name":"MCLD_228","rooms_type":"Tiered Large Group"},{"rooms_address":"2350 Health Sciences Mall","rooms_name":"LSC_1003","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B313","rooms_type":"Tiered Large Group"},{"rooms_address":"2350 Health Sciences Mall","rooms_name":"LSC_1001","rooms_type":"Tiered Large Group"},{"rooms_address":"2350 Health Sciences Mall","rooms_name":"LSC_1002","rooms_type":"Tiered Large Group"},{"rooms_address":"6356 Agricultural Road","rooms_name":"LSK_200","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_A104","rooms_type":"Tiered Large Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_A102","rooms_type":"Tiered Large Group"},{"rooms_address":"1874 East Mall","rooms_name":"BRKX_2365","rooms_type":"Tiered Large Group"},{"rooms_address":"6270 University Boulevard","rooms_name":"BIOL_2200","rooms_type":"Tiered Large Group"},{"rooms_address":"6270 University Boulevard","rooms_name":"BIOL_2000","rooms_type":"Tiered Large Group"},{"rooms_address":"2202 Main Mall","rooms_name":"AERL_120","rooms_type":"Tiered Large Group"},{"rooms_address":"6356 Agricultural Road","rooms_name":"LSK_201","rooms_type":"Tiered Large Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_354","rooms_type":"Tiered Large Group"}]}
        return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            //expect(value.body).to.deep.equal(result);
            Log.test("passed here")
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });

    it("200 testing out rooms name simple", function () {

        var queryTest: any = {
            "WHERE": {
                "AND":[{
                    "IS": {
                        "rooms_name": "*_*"
                    }
                },
                    {
                        "IS": {
                            "rooms_furniture": "Classroom-Movable Tables & Chairs"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name", "rooms_type"
                ],
                "ORDER": "rooms_type",
                "FORM": "TABLE"
            }
        }

        var result:any =
            {"render":"TABLE","result":[{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4068","rooms_type":"Active Learning"},{"rooms_address":"2356 Main Mall","rooms_name":"MCLD_242","rooms_type":"Open Design General Purpose"},{"rooms_address":"1822 East Mall","rooms_name":"ALRD_113","rooms_type":"Open Design General Purpose"},{"rooms_address":"1874 East Mall","rooms_name":"BRKX_2367","rooms_type":"Open Design General Purpose"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B141","rooms_type":"Open Design General Purpose"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D204","rooms_type":"Open Design General Purpose"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B142","rooms_type":"Open Design General Purpose"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B318","rooms_type":"Open Design General Purpose"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D201","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_409","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_407","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_405","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_309","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_307","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_305","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_109","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_107","rooms_type":"Open Design General Purpose"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_105","rooms_type":"Open Design General Purpose"},{"rooms_address":"2360 East Mall V6T 1Z3","rooms_name":"CHBE_103","rooms_type":"Open Design General Purpose"},{"rooms_address":"6339 Stores Road","rooms_name":"EOSM_135","rooms_type":"Open Design General Purpose"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_101","rooms_type":"Open Design General Purpose"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_200","rooms_type":"Open Design General Purpose"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_147","rooms_type":"Open Design General Purpose"},{"rooms_address":"1984 West Mall","rooms_name":"GEOG_201","rooms_type":"Open Design General Purpose"},{"rooms_address":"2045 East Mall","rooms_name":"HEBB_13","rooms_type":"Open Design General Purpose"},{"rooms_address":"6331 Crescent Road V6T 1Z1","rooms_name":"UCLL_107","rooms_type":"Open Design General Purpose"},{"rooms_address":"2045 East Mall","rooms_name":"HEBB_10","rooms_type":"Open Design General Purpose"},{"rooms_address":"2045 East Mall","rooms_name":"HEBB_12","rooms_type":"Open Design General Purpose"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_254","rooms_type":"Open Design General Purpose"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_437","rooms_type":"Open Design General Purpose"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_296","rooms_type":"Open Design General Purpose"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_432","rooms_type":"Open Design General Purpose"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_435","rooms_type":"Open Design General Purpose"},{"rooms_address":"6108 Thunderbird Boulevard","rooms_name":"OSBO_A","rooms_type":"Open Design General Purpose"},{"rooms_address":"6000 Iona Drive","rooms_name":"IONA_633","rooms_type":"Open Design General Purpose"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_261","rooms_type":"Open Design General Purpose"},{"rooms_address":"6356 Agricultural Road","rooms_name":"LSK_462","rooms_type":"Open Design General Purpose"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1001","rooms_type":"Open Design General Purpose"},{"rooms_address":"6356 Agricultural Road","rooms_name":"LSK_460","rooms_type":"Open Design General Purpose"},{"rooms_address":"2356 Main Mall","rooms_name":"MCLD_214","rooms_type":"Open Design General Purpose"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1002","rooms_type":"Open Design General Purpose"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3208","rooms_type":"Open Design General Purpose"},{"rooms_address":"2356 Main Mall","rooms_name":"MCLD_254","rooms_type":"Open Design General Purpose"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_154","rooms_type":"Open Design General Purpose"},{"rooms_address":"1984 Mathematics Road","rooms_name":"MATH_203","rooms_type":"Open Design General Purpose"},{"rooms_address":"1984 Mathematics Road","rooms_name":"MATH_104","rooms_type":"Open Design General Purpose"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3002","rooms_type":"Open Design General Purpose"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3058","rooms_type":"Open Design General Purpose"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_3074","rooms_type":"Open Design General Purpose"},{"rooms_address":"6363 Agronomy Road","rooms_name":"ORCH_4058","rooms_type":"Open Design General Purpose"},{"rooms_address":"1822 East Mall","rooms_name":"ALRD_112","rooms_type":"Open Design General Purpose"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3114","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G65","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3120","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3124","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_209","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_207","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_205","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_204","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_202","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_200","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1024","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1022","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1020","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1004","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_210","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_208","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_206","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_204A","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1328","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1023","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1021","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1005","rooms_type":"Small Group"},{"rooms_address":"2125 Main Mall","rooms_name":"SCRF_1003","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3112","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3115","rooms_type":"Small Group"},{"rooms_address":"1984 Mathematics Road","rooms_name":"MATH_102","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_360M","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_358","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_256","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3118","rooms_type":"Small Group"},{"rooms_address":"2357 Main Mall","rooms_name":"MCML_260","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G57","rooms_type":"Small Group"},{"rooms_address":"2356 Main Mall","rooms_name":"MCLD_220","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3122","rooms_type":"Small Group"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1011","rooms_type":"Small Group"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1302","rooms_type":"Small Group"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1009","rooms_type":"Small Group"},{"rooms_address":"2080 West Mall","rooms_name":"SOWK_326","rooms_type":"Small Group"},{"rooms_address":"2080 West Mall","rooms_name":"SOWK_122","rooms_type":"Small Group"},{"rooms_address":"2080 West Mall","rooms_name":"SOWK_324","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_460","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_265","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_195","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_191","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_157","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_264","rooms_type":"Small Group"},{"rooms_address":"6445 University Boulevard","rooms_name":"PCOH_1215","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_185","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_158","rooms_type":"Small Group"},{"rooms_address":"1961 East Mall V6T 1Z1","rooms_name":"IBLC_156","rooms_type":"Small Group"},{"rooms_address":"6108 Thunderbird Boulevard","rooms_name":"OSBO_203A","rooms_type":"Small Group"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_201","rooms_type":"Small Group"},{"rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_name":"DMP_101","rooms_type":"Small Group"},{"rooms_address":"2206 East Mall","rooms_name":"SPPH_B136","rooms_type":"Small Group"},{"rooms_address":"2206 East Mall","rooms_name":"SPPH_B112","rooms_type":"Small Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_339","rooms_type":"Small Group"},{"rooms_address":"2206 East Mall","rooms_name":"SPPH_B138","rooms_type":"Small Group"},{"rooms_address":"2405 Wesbrook Mall","rooms_name":"PHRM_3116","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G53","rooms_type":"Small Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_332","rooms_type":"Small Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_292","rooms_type":"Small Group"},{"rooms_address":"6303 North West Marine Drive","rooms_name":"ANSO_202","rooms_type":"Small Group"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_232","rooms_type":"Small Group"},{"rooms_address":"6224 Agricultural Road","rooms_name":"HENN_302","rooms_type":"Small Group"},{"rooms_address":"6224 Agricultural Road","rooms_name":"HENN_304","rooms_type":"Small Group"},{"rooms_address":"6224 Agricultural Road","rooms_name":"HENN_301","rooms_type":"Small Group"},{"rooms_address":"1924 West Mall","rooms_name":"AUDX_157","rooms_type":"Small Group"},{"rooms_address":"6331 Crescent Road V6T 1Z1","rooms_name":"UCLL_101","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_106","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_108","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_110","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_306","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_308","rooms_type":"Small Group"},{"rooms_address":"6333 Memorial Road","rooms_name":"LASR_211","rooms_type":"Small Group"},{"rooms_address":"6333 Memorial Road","rooms_name":"LASR_5C","rooms_type":"Small Group"},{"rooms_address":"6350 Stores Road","rooms_name":"FORW_519","rooms_type":"Small Group"},{"rooms_address":"6350 Stores Road","rooms_name":"FORW_317","rooms_type":"Small Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1615","rooms_type":"Small Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1611","rooms_type":"Small Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1617","rooms_type":"Small Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1613","rooms_type":"Small Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1402","rooms_type":"Small Group"},{"rooms_address":"2424 Main Mall","rooms_name":"FSC_1002","rooms_type":"Small Group"},{"rooms_address":"2205 East Mall","rooms_name":"FNH_30","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_310","rooms_type":"Small Group"},{"rooms_address":"6250 Applied Science Lane","rooms_name":"CEME_1206","rooms_type":"Small Group"},{"rooms_address":"6250 Applied Science Lane","rooms_name":"CEME_1210","rooms_type":"Small Group"},{"rooms_address":"2175 West Mall V6T 1Z4","rooms_name":"SWNG_410","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D325","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D315","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D229","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D214","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D209","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D205","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G44","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G55","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B312","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G59","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D323","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D319","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D221","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_D207","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G66","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B316","rooms_type":"Small Group"},{"rooms_address":"1866 Main Mall","rooms_name":"BUCH_B216","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_B75","rooms_type":"Small Group"},{"rooms_address":"2194 Health Sciences Mall","rooms_name":"WOOD_G41","rooms_type":"Small Group"},{"rooms_address":"6270 University Boulevard","rooms_name":"BIOL_1503","rooms_type":"Small Group"},{"rooms_address":"6270 University Boulevard","rooms_name":"BIOL_2519","rooms_type":"Small Group"},{"rooms_address":"1924 West Mall","rooms_name":"AUDX_142","rooms_type":"Small Group"},{"rooms_address":"6000 Student Union Blvd","rooms_name":"SRC_220C","rooms_type":"TBD"},{"rooms_address":"6000 Student Union Blvd","rooms_name":"SRC_220A","rooms_type":"TBD"},{"rooms_address":"6000 Student Union Blvd","rooms_name":"SRC_220B","rooms_type":"TBD"},{"rooms_address":"2053 Main Mall","rooms_name":"ANGU_293","rooms_type":"TBD"}]}

            return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            //expect(expectedResult).include(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            //expect(value.body).to.deep.equal(result);
            Log.test("passed here")
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })


    });


});