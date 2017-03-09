/**
 * Created by johnz on 2017-03-08.
 */
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade, FilterQuery, MCompare} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


describe("D3QueryTestSpec", function () {

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

    it.only("checking out NO FILTER complex query provided in deliverable", function () {
        var queryTest: any = {
            "WHERE": {
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }
        //sanityCheck(queryTest);
        var result = {"true": ["courses"]};
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);
    });

    it("checking out weird query provided in deliverable", function () {
        var queryTest: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        }
        sanityCheck(queryTest);
        var result = {"true": ["rooms"]};
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);
    });

    it("checking out complex query provided in deliverable", function () {
        var queryTest: any = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }
        sanityCheck(queryTest);
        var result = {"true": ["rooms"]};
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);
    });

    it.skip("400 transform", function () {
        var queryTest:any =    {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "anything"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["anything"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "anything": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing":["fake", "sham"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })



    });
    it("200 testing out new ORDER with no TRANSFORMATION", function () {

        var queryTest: QueryRequest =  {
            "WHERE": {
                "AND": [{
                    "OR":[{
                        "IS":{
                            "rooms_type":"Tiered Large Group"
                        }
                    }]},
                    {
                        "GT": {
                            "rooms_lat": 49.2612
                        }
                    },
                    {
                        "LT": {
                            "rooms_lat": 49.26129
                        }
                    },
                    {
                        "LT": {
                            "rooms_lon": -123.2480
                        }
                    },
                    {
                        "GT": {
                            "rooms_lon": -123.24809
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_shortname",
                    "rooms_number",
                    "rooms_name",
                    "rooms_address",
                    "rooms_type",
                    "rooms_furniture",
                    "rooms_href",
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_number", "rooms_href"]
                },
                "FORM": "TABLE"
            }
        }

        var result =
            {"render":"TABLE","result":[{"rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"310","rooms_name":"DMP_310","rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-310","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":160},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"301","rooms_name":"DMP_301","rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-301","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":80},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_shortname":"DMP","rooms_number":"110","rooms_name":"DMP_110","rooms_address":"6245 Agronomy Road V6T 1Z4","rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Fixed Tables/Movable Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-110","rooms_lat":49.26125,"rooms_lon":-123.24807,"rooms_seats":120}]}
        return insightFacade.performQuery(queryTest).then(function (value: any) {
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result["result"];
            expect(value.body).to.deep.equal(result);
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            for(let x in expectedResult){
                expect(resultKey).to.include(expectedResult[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })




    });


});