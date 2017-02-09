/**
 * Created by johnz on 2017-01-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade, FilterQuery, MCompare} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


describe("QueryTestSpec", function () {

    var insightFacade:InsightFacade = null;
    var insight:InsightFacade = null;
    var testInvalidKeys:string[] = [];
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
        return insight.addDataset('courses',fs.readFileSync('courses.zip').toString('base64'))


    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        //insightFacade = new InsightFacade();
        //return insight.addDataset('courses',fs.readFileSync('courses.zip').toString('base64'))
       // return insightFacade.removeDataset('courses');

    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        //insightFacade = null
        return insight.removeDataset('courses');
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        //return insight.removeDataset('courses');


    });


    it("testing out simple query provided in deliverable", function () {
        var queryTest:QueryRequest = {
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
        }
        var keyTest = Object.keys(queryTest);

        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.equal(true);


    });

    it("testing out merge", function () {
        var queryTest:any = { courses_dept: 'epse', courses_avg: 98.45 }
        var queryTest2:any = { courses_dept: 'epse', courses_avg: 98.45 }

        var keyTest = Object.keys(queryTest);

        
        expect(insightFacade.mergeDeDuplicate(queryTest, queryTest2)).to.equal(queryTest);


    });


    it("testing out complex query provided in deliverable", function () {
        var queryTest:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"*adhe*"
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);
        var result = ["course"];
        expect(insightFacade.isValid(queryTest)).to.equal(true);


    });

    it("testing out complex query provided in deliverable", function () {
        var queryTest:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "course_avg":90.1
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"*adhe*"
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);
        var result = ["course"];
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("Test Fails: testing out faulty query", function () {
        var queryTest:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":10
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":"blah"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.equal(false);


    });

    it("testing hasFilter() with nested filters", function () {
        var queryTest:any =     {

            "OR":[
                {
                    "AND":[
                        {
                            "GT":{
                                "courses_avg":90
                            }
                        },
                        {
                            "IS":{
                                "courses_dept":10
                            }
                        }
                    ]
                },
                {
                    "EQ":{
                        "courses_avg":"blah"
                    }
                }
            ]


        }

        expect(insightFacade.hasFilter(queryTest, testInvalidKeys)).to.equal(false);


    });

    it("testing out complex query with further nested array", function () {
        var queryTest:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT":{
                                    "AND":[
                                        {
                                            "GT":{
                                                "courses_avg":"haha"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.equal(false);



    });

    it("424 unloaded fake id dataset", function () {
        var queryTest:any =     {
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
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"error":["fake", "sham"]})
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"error":["fake", "sham"]})
        })



    });

    it("424 unloaded fake id in options", function () {
        var queryTest:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT":{
                                    "AND":[
                                        {
                                            "GT":{
                                                "courses_avg":90
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "fake_dept",
                    "fake_id",
                    "courses_avg"
                ],
                "ORDER":"sham_avg",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"error":["fake", "sham"]})
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"error":["fake", "sham"]})
        })



    });

    it("400 testing out complex query with further nested array errors", function () {
        var queryTest:any =     {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    }
                                ]
                            },
                            {
                                "NOT":{
                                    "AND":[
                                        {
                                            "GT":{
                                                "courses_avg":"haha"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({"error":"invalid query"})
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })



    });


    it("200 testing out simple query provided in deliverable", function () {
        var queryTest:QueryRequest = {
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
        }

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'epse', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.09 },
                    { courses_dept: 'epse', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.25 },
                    { courses_dept: 'math', courses_avg: 97.25 },
                    { courses_dept: 'epse', courses_avg: 97.29 },
                    { courses_dept: 'epse', courses_avg: 97.29 },
                    { courses_dept: 'nurs', courses_avg: 97.33 },
                    { courses_dept: 'nurs', courses_avg: 97.33 },
                    { courses_dept: 'epse', courses_avg: 97.41 },
                    { courses_dept: 'epse', courses_avg: 97.41 },
                    { courses_dept: 'cnps', courses_avg: 97.47 },
                    { courses_dept: 'cnps', courses_avg: 97.47 },
                    { courses_dept: 'math', courses_avg: 97.48 },
                    { courses_dept: 'math', courses_avg: 97.48 },
                    { courses_dept: 'educ', courses_avg: 97.5 },
                    { courses_dept: 'nurs', courses_avg: 97.53 },
                    { courses_dept: 'nurs', courses_avg: 97.53 },
                    { courses_dept: 'epse', courses_avg: 97.67 },
                    { courses_dept: 'epse', courses_avg: 97.69 },
                    { courses_dept: 'epse', courses_avg: 97.78 },
                    { courses_dept: 'crwr', courses_avg: 98 },
                    { courses_dept: 'crwr', courses_avg: 98 },
                    { courses_dept: 'epse', courses_avg: 98.08 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'epse', courses_avg: 98.36 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.7 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.8 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 } ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            //return JSON.parse(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });
/**
    it("200 testing out simple query with NOT", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "NOT":{"NOT":{"NOT":{"NOT":{"NOT":{"NOT":{"NOT":
                    {
                        "LT":{
                            "courses_avg":99
                        }
                    }}}}}}}

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 }
                    ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    }); */

    it("200 testing out simple query with NOT ORDER alphabet", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                /*"NOT":
                    {*/
                        "GT":{
                            "courses_avg":98.9
                        }
                    //}

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_dept",
                "FORM":"TABLE"
            }
        }

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'spph', courses_avg: 98.98 }
                ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });



    it("200 testing out complex query provided in deliverable", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02 },
                    { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.16 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17 },
                    { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.18 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.72 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.85 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.48 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 93.33 },
                    { courses_dept: 'rhsc', courses_id: '501', courses_avg: 95 },
                    { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
                    { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
                    { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
                    { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
                    { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
                    { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'sowk', courses_id: '570', courses_avg: 95 },
                    { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
                    { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
                    { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
                    { courses_dept: 'epse', courses_id: '606', courses_avg: 95 },
                    { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
                    { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
                    { courses_dept: 'kin', courses_id: '499', courses_avg: 95 },
                    { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
                    { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
                    { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
                    { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
                    { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
                    { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
                    { courses_dept: 'mtrl', courses_id: '599', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                    { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
                    { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
                    { courses_dept: 'obst', courses_id: '549', courses_avg: 95 },
                    { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
                    { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
                    { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 96.11 } ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            Log.info("info");
            Log.error("error");
            Log.test("test");
            Log.trace("trace");
            Log.warn("warn");
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });


    it("200 testing out Double Negative", function () {

        var queryTest:QueryRequest = {
            "WHERE":{
                "NOT":{
                    "NOT":{
                        "GT":{
                            "courses_avg":98
                        }
                    }
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
        }

        var result = { render: 'TABLE',
            result:
                [   { courses_dept: 'epse', courses_avg: 98.08 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'epse', courses_avg: 98.36 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.7 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.8 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 } ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        })


    });


    it("200 testing out AND", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "GT":{
                            "courses_avg":90
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"adhe"
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02 },
                    { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.16 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17 },
                    { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.18 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.72 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.85 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                    { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.48 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 93.33 },
                    { courses_dept: 'adhe', courses_id: '329', courses_avg: 96.11 } ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out OR", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "OR":[
                    {
                        "GT":{
                            "courses_avg":99
                        }
                    },
                    {
                        "GT":{
                            "courses_fail":280
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_fail"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        /**courses_dept	courses_id	courses_avg	courses_fail
        chem	121	68.2	287
        cnps	574	99.19	0
        math	527	99.78	0
        math	527	99.78	0*/
        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'chem', courses_id: '121', courses_avg: 68.2, courses_fail:287 },
                    { courses_dept: 'cnps', courses_id: '574', courses_avg: 99.19, courses_fail:0 },
                    { courses_dept: 'math', courses_id: '527', courses_avg: 99.78, courses_fail:0 },
                    { courses_dept: 'math', courses_id: '527', courses_avg: 99.78, courses_fail:0 }
                   ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });




});
