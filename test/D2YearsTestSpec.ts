/**
 * Created by johnz on 2017-02-25.
 */

import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade, FilterQuery, MCompare} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


describe("D2YearsTestSpec", function () {

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
        //return insight.addDataset('rooms', fs.readFileSync('rooms.zip').toString('base64'))
        return insight.addDataset('courses', fs.readFileSync('courses.zip').toString('base64'))


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
        return insight.removeDataset('courses');
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        //return insight.removeDataset('courses');


    });


    it("200 testing out simple query YEARS", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "GT": {
                        "courses_year": 2015
                    }
                },
                    {
                        "GT":{
                            "courses_avg":97
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_year",
                "FORM":"TABLE"
            }
        }

        var result =
            {"render":"TABLE","result":[{"courses_dept":"math","courses_year":2016,"courses_uuid":"32014","courses_avg":97.25}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });

    it("200 testing out edge simple query YEARS", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "EQ": {
                        "courses_year": 1900
                    }
                },
                    {
                        "GT":{
                            "courses_avg":97
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_year",
                "FORM":"TABLE"
            }
        }

        var result =
            {"render":"TABLE","result":[{"courses_dept":"math","courses_year":1900,"courses_uuid":"5374","courses_avg":99.78},{"courses_dept":"cnps","courses_year":1900,"courses_uuid":"87780","courses_avg":97.47},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"33781","courses_avg":98.36},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"35871","courses_avg":97.29},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"29256","courses_avg":98.58},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"44817","courses_avg":98.76},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"49678","courses_avg":98.45},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"76311","courses_avg":97.41},{"courses_dept":"epse","courses_year":1900,"courses_uuid":"86963","courses_avg":97.09},{"courses_dept":"math","courses_year":1900,"courses_uuid":"32015","courses_avg":97.25},{"courses_dept":"eece","courses_year":1900,"courses_uuid":"10236","courses_avg":98.75},{"courses_dept":"math","courses_year":1900,"courses_uuid":"73166","courses_avg":97.48},{"courses_dept":"math","courses_year":1900,"courses_uuid":"73174","courses_avg":97.09},{"courses_dept":"nurs","courses_year":1900,"courses_uuid":"15344","courses_avg":98.71},{"courses_dept":"nurs","courses_year":1900,"courses_uuid":"73639","courses_avg":98.21},{"courses_dept":"nurs","courses_year":1900,"courses_uuid":"73666","courses_avg":97.53},{"courses_dept":"nurs","courses_year":1900,"courses_uuid":"88152","courses_avg":98.5},{"courses_dept":"nurs","courses_year":1900,"courses_uuid":"96251","courses_avg":98.58},{"courses_dept":"nurs","courses_year":1900,"courses_uuid":"96262","courses_avg":97.33},{"courses_dept":"spph","courses_year":1900,"courses_uuid":"65070","courses_avg":98.98}]}

            return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });

    it("200 testing out edge GT 2016 simple query YEARS", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "LT": {
                        "courses_year": 1900
                    }
                },
                    {
                        "GT":{
                            "courses_avg":97
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_year",
                "FORM":"TABLE"
            }
        }

        var result:any = {"render":"TABLE", "result":[]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });

    it.only("200 testing out edge LT 1900 simple query YEARS", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "GT": {
                        "courses_year": 2016
                    }
                },
                    {
                        "GT":{
                            "courses_avg":97
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result:any = {"render":"TABLE", "result":[]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });

    it("424 unloaded rooms first then courses", function () {
        var queryTest: any = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "AND": [
                                    {
                                        "GT": {
                                            "rooms_avg": 90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT": {
                                    "AND": [
                                        {
                                            "GT": {
                                                "courses_seats": 90
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
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
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing": ["rooms"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing": ["rooms"]})
        })
    });

    it("424 unloaded order exists in columns", function () {
        var queryTest: any = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "AND": [
                                    {
                                        "GT": {
                                            "courses_avg": 90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT": {
                                    "AND": [
                                        {
                                            "GT": {
                                                "courses_avg": 90
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "rooms_avg"
                ],
                "ORDER": "rooms_avg",
                "FORM": "TABLE"
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing": ["rooms"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing": ["rooms"]})
        })
    });

    it("400 unloaded order doesn't exist in columns", function () {
        var queryTest: any = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "AND": [
                                    {
                                        "GT": {
                                            "courses_avg": 90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT": {
                                    "AND": [
                                        {
                                            "GT": {
                                                "courses_avg": 90
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "rooms_avg",
                "FORM": "TABLE"
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing": ["rooms"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })
    });

    it("400 unloaded order courses wrong key", function () {
        var queryTest: any = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "AND": [
                                    {
                                        "GT": {
                                            "courses_avg": 90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT": {
                                    "AND": [
                                        {
                                            "GT": {
                                                "courses_avg": 90
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_seats"
                ],
                "ORDER": "courses_seats",
                "FORM": "TABLE"
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing": ["rooms"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })
    });

    it("424 unloaded overall weird key", function () {
        var queryTest: any = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "AND": [
                                    {
                                        "GT": {
                                            "rooms_s": 90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT": {
                                    "AND": [
                                        {
                                            "GT": {
                                                "courses_a": 90
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_seats"
                ],
                "ORDER": "courses_seats",
                "FORM": "TABLE"
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse) {
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing": ["rooms"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing": ["rooms"]})
        })
    });

    it("424 testing out invalid keys crap_instructor", function () {
        var queryTest:any = {
            "WHERE":{
                "AND": [{
                    "IS": {
                        "crap_instructor": "*test"
                    }
                },
                    {
                        "IS":{
                            "damn_fullname":"testname"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result:any = {"render":"TABLE", "result":[]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["crap", "damn"]})

        })


    });

    it("424 testing out invalid keys crap_instructor, damn_s", function () {
        var queryTest:any = {
            "WHERE":{
                "AND": [{
                    "IS": {
                        "crap_instructor": "*test"
                    }
                },
                    {
                        "IS":{
                            "damn_fullnames":"testname"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result:any = {"render":"TABLE", "result":[]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["crap", "damn"]})

        })


    });

    it("424 testing out all courses then rooms", function () {
        var queryTest:any = {
            "WHERE":{
                "AND": [{
                    "IS": {
                        "courses_instructor": "*test"
                    }
                },
                    {
                        "IS":{
                            "courses_dept":"testname"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_shortname",
                    "courses_year",
                    "courses_uuid",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result:any = {"render":"TABLE", "result":[]}
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);

            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["rooms"]})

        })


    });

    it("424 testing out all rooms then courses", function () {
        var queryTest:any = {
            "WHERE":{
                "AND": [{
                    "IS": {
                        "rooms_name": "*test"
                    }
                },
                    {
                        "IS":{
                            "rooms_fullname":"testname"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_shortname",
                    "rooms_name",
                    "rooms_fullname",
                    "courses_avg"
                ],
                "ORDER":"rooms_fullname",
                "FORM":"TABLE"
            }
        }

        var result:any = {"render":"TABLE", "result":[]}
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