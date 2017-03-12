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
        //return insight.removeDataset('courses');

    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        //return insight.removeDataset('courses');


    });

    it("checking out NO FILTER complex query provided in deliverable", function () {
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
                "ORDER": {},
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

    it( "200 transform", function () {
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

        var result = {"render":"TABLE","result":[{"rooms_shortname":"OSBO","anything":442},{"rooms_shortname":"HEBB","anything":375},{"rooms_shortname":"LSC","anything":350}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result)
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"malformed transformation"})
        })



    });

    it.only( "200 multiple transform", function () {
        var queryTest:any =    {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 100
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "anything",
                    "something",
                    "many things"
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
                },
                    {
                        "something": {
                            "COUNT": "rooms_seats"
                        }
                    },
                    {
                        "many things": {
                            "SUM": "rooms_seats"
                        }
                    }
                ]
            }
        }
        sanityCheck(queryTest);

        var result =
            {"render":"TABLE","result":[{"rooms_shortname":"OSBO","anything":442,"something":1,"many things":442},{"rooms_shortname":"HEBB","anything":375,"something":1,"many things":375},{"rooms_shortname":"LSC","anything":350,"something":2,"many things":825},{"rooms_shortname":"SRC","anything":299,"something":1,"many things":897},{"rooms_shortname":"ANGU","anything":260,"something":1,"many things":260},{"rooms_shortname":"PHRM","anything":236,"something":2,"many things":403},{"rooms_shortname":"LSK","anything":205,"something":2,"many things":388},{"rooms_shortname":"CHBE","anything":200,"something":1,"many things":200},{"rooms_shortname":"SWNG","anything":190,"something":3,"many things":755},{"rooms_shortname":"DMP","anything":160,"something":2,"many things":280},{"rooms_shortname":"FRDM","anything":160,"something":1,"many things":160},{"rooms_shortname":"IBLC","anything":154,"something":2,"many things":266},{"rooms_shortname":"MCLD","anything":136,"something":2,"many things":259},{"rooms_shortname":"WOOD","anything":120,"something":1,"many things":360},{"rooms_shortname":"BUCH","anything":108,"something":1,"many things":216}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result)
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"malformed transformation"})
        })



    });

    it( "424 dataset in apply", function () {
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
                    "test_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["test_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "other_seats"
                    }
                }]
            }
        }

        var result = {"render":"TABLE","result":[{"rooms_shortname":"OSBO","anything":442},{"rooms_shortname":"HEBB","anything":375},{"rooms_shortname":"LSC","anything":350}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result)
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["test","other"]})
        })



    });

    it( "200 simple query deliverable", function () {
        var queryTest:any =   {
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

        var result =
            {
                "render": "TABLE",
                "result": [{
                    "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
                }, {
                    "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs"
                }, {
                    "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs"
                }, {
                    "rooms_furniture": "Classroom-Fixed Tablets"
                }, {
                    "rooms_furniture": "Classroom-Hybrid Furniture"
                }, {
                    "rooms_furniture": "Classroom-Learn Lab"
                }, {
                    "rooms_furniture": "Classroom-Movable Tables & Chairs"
                }, {
                    "rooms_furniture": "Classroom-Movable Tablets"
                }, {
                    "rooms_furniture": "Classroom-Moveable Tables & Chairs"
                }, {
                    "rooms_furniture": "Classroom-Moveable Tablets"
                }]
            }
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result)
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"malformed transformation"})
        })

    });

    it( "200 simple query no ORDER with TRANSFORMATION", function () {
        var queryTest:any =   {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        }
        sanityCheck(queryTest);

        var result =
            {"render":"TABLE","result":[{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Moveable Tablets"}]}

        return insightFacade.performQuery(queryTest).then(function (value: any){
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"];
            var expectedResult:any = result["result"];
            for(let x in resultKey){
                expect(expectedResult).to.include(resultKey[x])
            }
            for(let x in expectedResult){
                expect(resultKey).to.include(expectedResult[x])
            }
            //expect(expectedResult).includes(resultKey);
            expect(expectedResult.length).to.deep.equal(resultKey.length);
            //expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"malformed transformation"})
        })

    });

    it("200 testing out new ORDER with no TRANSFORMATION", function () {

        var queryTest: any =  {
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
            expect(err.body).to.deep.equal({"missing": ["rooms"]})

        })




    });


});