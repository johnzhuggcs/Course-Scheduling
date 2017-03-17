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
        //return insight.addDataset('rooms', fs.readFileSync('rooms.zip').toString('base64'))


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
        //return insight.removeDataset("rooms");
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
        var result = {"true":["courses"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("testing out merge", function () {
        var queryTest:any = { courses_dept: 'epse', courses_avg: 98.45 }
        var queryTest2:any = { courses_dept: 'epse', courses_avg: 98.45 }

        var keyTest = Object.keys(queryTest);

        
        expect(insightFacade.mergeDeDuplicate(queryTest, queryTest2)).to.deep.equal(queryTest);


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
        var result = {"true":["courses"]};
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


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
        var result = {"false":["course"]};
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

        var isOneDataSet ={"true":["courses"]}
        expect(insightFacade.hasFilter(queryTest, testInvalidKeys, isOneDataSet)).to.equal(false);


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
            expect(value.body).to.deep.equal({"missing":["fake", "sham"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["fake", "sham"]})
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
                "ORDER":"fake_dept",
                "FORM":"TABLE"
            }
        }
        sanityCheck(queryTest);
        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing":["fake"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["fake"]})
        })



    });

    it("424 unloaded fake id in options rooms", function () {
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
                                                "rooms_seats":90
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
            expect(value.code).to.equal(424);
            expect(value.body).to.deep.equal({"missing":["rooms"]})
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["rooms"]})
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
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })



    });


    it.only("200 testing out simple query provided in deliverable", function () {
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

            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })


    });

    it("200 testing out simple query with NOT", function () {
        var queryTest:QueryRequest = {
            "WHERE"://{
                //"NOT":{"NOT":{"NOT":{"NOT":
                    {"NOT":{"NOT":{"NOT":
                    {
                        "LT":{
                            "courses_avg":99
                        //}
                    }}}}//}}}

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
    });

    it("400 invalid order", function () {
        var queryTest:QueryRequest = {
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

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 }
                ] }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(400);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })
    });

    it("400 invalid order", function () {
        var queryTest:QueryRequest = {
            "WHERE"://{
            //"NOT":{"NOT":{"NOT":{"NOT":
                {"NOT":{"NOT":{"NOT":
                    {
                        "LT":{
                            "courses_avg":99
                            //}
                        }}}}//}}}

                },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"fake_stuff",
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
            expect(value.code).to.equal(400);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })
    });

    it("400 invalid order", function () {
        var queryTest:QueryRequest = {
            "WHERE"://{
            //"NOT":{"NOT":{"NOT":{"NOT":
                {"NOT":{"NOT":{"NOT":
                    {
                        "LT":{
                            "courses_avg":99
                            //}
                        }}}}//}}}

                },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_instructor",
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
            expect(value.code).to.equal(400);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})

        })
    });

    it("400 conflict with 424 invalid order", function () {
        var queryTest:any = {
            "WHERE"://{
            //"NOT":{"NOT":{"NOT":{"NOT":
                {"NOT":{"NOT":{"NOT":
                    {
                        "LT":{
                            "courses_avg":99
                            //}
                        }}}}//}}}

                },
            "OPTIONS":{
                "COLUMNS":[
                    "course_test",
                    "courses_avg"
                ],
                "ORDER":"course_test",
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
            expect(value.code).to.equal(400);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"missing":["course"]})

        })
    });


    it("200 testing out AND samething", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {"GT" : {"courses_avg":99}},
                    {"GT" : {"courses_avg":99}}
                ]

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
    });

    it("200 testing out simple query with NOT ORDER alphabet", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "NOT":
                    {
                        "LT":{
                            "courses_avg":98.9
                        }
                    }

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
            Log.test('Error: ' + err);
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




    it("200 testing out * IS", function () {
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
                            "courses_dept":"*adhe"
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
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out Fireball", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_id":"383"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"*in"
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
        /** courses_dept	courses_id	courses_avg
         kin	383	80.19
         kin	383	80.19
         kin	383	80.51
         kin	383	80.51
         kin	383	81.26
         kin	383	81.26
         kin	383	82.49
         kin	383	82.49 */

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'kin', courses_id: '383', courses_avg: 80.19 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 80.19 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 80.51 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 80.51 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 81.26 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 81.26 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 82.49 },
                    { courses_dept: 'kin', courses_id: '383', courses_avg: 82.49 }
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

    it("200 testing out partial prof name", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"yang*"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"comm"
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        // comm	293	63.61	yang, shuo

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'comm', courses_id: '293', courses_avg: 63.61, courses_instructor: "yang, shuo" }
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

    it("200 testing out partial uuid, prof everything", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"yang*"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"comm"
                        }
                    },
                    {
                        "IS":{
                            "courses_uuid":"19116"
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor",
                    "courses_uuid"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        // comm	293	63.61	yang, shuo

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'comm', courses_id: '293', courses_avg: 63.61, courses_instructor: "yang, shuo", courses_uuid:"19116" }
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

    it("200 testing out partial *yang* uuid, prof everything", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"*yang, *"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"*comm"
                        }
                    },
                    {
                        "IS":{
                            "courses_uuid":"*19116*"
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor",
                    "courses_uuid"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        // comm	293	63.61	yang, shuo

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'comm', courses_id: '293', courses_avg: 63.61, courses_instructor: "yang, shuo", courses_uuid:"19116" }
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

    it("200 testing out partial name return all prof", function () {
        var queryTest:QueryRequest = {
            "WHERE":{

                "IS":{
                    "courses_instructor":"*yang*"
                }

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_uuid"
                ],
                "ORDER":"courses_uuid",
                "FORM":"TABLE"
            }
        }


        var result = {"render":"TABLE","result":[{"courses_uuid":"10736"},{"courses_uuid":"14615"},{"courses_uuid":"19116"},{"courses_uuid":"2063"},{"courses_uuid":"2065"},{"courses_uuid":"2067"},{"courses_uuid":"2069"},{"courses_uuid":"23236"},{"courses_uuid":"23238"},{"courses_uuid":"23240"},{"courses_uuid":"23242"},{"courses_uuid":"26967"},{"courses_uuid":"2840"},{"courses_uuid":"28444"},{"courses_uuid":"30750"},{"courses_uuid":"30752"},{"courses_uuid":"30754"},{"courses_uuid":"30756"},{"courses_uuid":"39485"},{"courses_uuid":"45016"},{"courses_uuid":"45108"},{"courses_uuid":"47872"},{"courses_uuid":"47967"},{"courses_uuid":"53254"},{"courses_uuid":"56357"},{"courses_uuid":"58867"},{"courses_uuid":"58877"},{"courses_uuid":"66311"},{"courses_uuid":"66313"},{"courses_uuid":"66315"},{"courses_uuid":"66317"},{"courses_uuid":"73371"},{"courses_uuid":"73373"},{"courses_uuid":"73375"},{"courses_uuid":"73377"},{"courses_uuid":"79527"},{"courses_uuid":"79615"},{"courses_uuid":"83176"},{"courses_uuid":"83178"},{"courses_uuid":"83180"},{"courses_uuid":"83182"},{"courses_uuid":"83577"},{"courses_uuid":"84805"},{"courses_uuid":"84891"},{"courses_uuid":"9415"},{"courses_uuid":"9437"},{"courses_uuid":"9439"},{"courses_uuid":"9441"},{"courses_uuid":"9443"}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });





    it("200 testing out partial name return all prof", function () {
        var queryTest:QueryRequest = {
            "WHERE":{

                "IS":{
                    "courses_instructor":"*yang*"
                }

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_uuid"
                ],
                "ORDER":"courses_uuid",
                "FORM":"TABLE"
            }
        }


        var result = {"render":"TABLE","result":[{"courses_uuid":"10736"},{"courses_uuid":"14615"},{"courses_uuid":"19116"},{"courses_uuid":"2063"},{"courses_uuid":"2065"},{"courses_uuid":"2067"},{"courses_uuid":"2069"},{"courses_uuid":"23236"},{"courses_uuid":"23238"},{"courses_uuid":"23240"},{"courses_uuid":"23242"},{"courses_uuid":"26967"},{"courses_uuid":"2840"},{"courses_uuid":"28444"},{"courses_uuid":"30750"},{"courses_uuid":"30752"},{"courses_uuid":"30754"},{"courses_uuid":"30756"},{"courses_uuid":"39485"},{"courses_uuid":"45016"},{"courses_uuid":"45108"},{"courses_uuid":"47872"},{"courses_uuid":"47967"},{"courses_uuid":"53254"},{"courses_uuid":"56357"},{"courses_uuid":"58867"},{"courses_uuid":"58877"},{"courses_uuid":"66311"},{"courses_uuid":"66313"},{"courses_uuid":"66315"},{"courses_uuid":"66317"},{"courses_uuid":"73371"},{"courses_uuid":"73373"},{"courses_uuid":"73375"},{"courses_uuid":"73377"},{"courses_uuid":"79527"},{"courses_uuid":"79615"},{"courses_uuid":"83176"},{"courses_uuid":"83178"},{"courses_uuid":"83180"},{"courses_uuid":"83182"},{"courses_uuid":"83577"},{"courses_uuid":"84805"},{"courses_uuid":"84891"},{"courses_uuid":"9415"},{"courses_uuid":"9437"},{"courses_uuid":"9439"},{"courses_uuid":"9441"},{"courses_uuid":"9443"}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 oh shit testing out partial name return all yang*", function () {
        var queryTest:QueryRequest = {
            "WHERE":{

                "IS":{
                    "courses_instructor":"yang*"
                }

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_uuid"
                ],
                "ORDER":"courses_uuid",
                "FORM":"TABLE"
            }
        }



        var result = {"render":"TABLE","result":[{"courses_uuid":"10736"},{"courses_uuid":"14615"},{"courses_uuid":"19116"},{"courses_uuid":"2063"},{"courses_uuid":"2065"},{"courses_uuid":"2067"},{"courses_uuid":"2069"},{"courses_uuid":"23236"},{"courses_uuid":"23238"},{"courses_uuid":"23240"},{"courses_uuid":"23242"},{"courses_uuid":"2840"},{"courses_uuid":"28444"},{"courses_uuid":"30750"},{"courses_uuid":"30752"},{"courses_uuid":"30754"},{"courses_uuid":"30756"},{"courses_uuid":"39485"},{"courses_uuid":"45016"},{"courses_uuid":"45108"},{"courses_uuid":"47872"},{"courses_uuid":"47967"},{"courses_uuid":"53254"},{"courses_uuid":"56357"},{"courses_uuid":"66311"},{"courses_uuid":"66313"},{"courses_uuid":"66315"},{"courses_uuid":"66317"},{"courses_uuid":"73371"},{"courses_uuid":"73373"},{"courses_uuid":"73375"},{"courses_uuid":"73377"},{"courses_uuid":"79527"},{"courses_uuid":"79615"},{"courses_uuid":"83176"},{"courses_uuid":"83178"},{"courses_uuid":"83180"},{"courses_uuid":"83182"},{"courses_uuid":"83577"},{"courses_uuid":"84805"},{"courses_uuid":"84891"},{"courses_uuid":"9415"},{"courses_uuid":"9437"},{"courses_uuid":"9439"},{"courses_uuid":"9441"},{"courses_uuid":"9443"}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 focus testing out partial name return all yang*", function () {
        var queryTest:QueryRequest = {
            "WHERE":{

                "IS":{
                    "courses_instructor":"yang*"
                }

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_uuid"
                ],
                "ORDER":"courses_uuid",
                "FORM":"TABLE"
            }
        }



        var result = {"render":"TABLE","result":[{"courses_uuid":"10736"},{"courses_uuid":"14615"},{"courses_uuid":"19116"},{"courses_uuid":"2063"},{"courses_uuid":"2065"},{"courses_uuid":"2067"},{"courses_uuid":"2069"},{"courses_uuid":"23236"},{"courses_uuid":"23238"},{"courses_uuid":"23240"},{"courses_uuid":"23242"},{"courses_uuid":"2840"},{"courses_uuid":"28444"},{"courses_uuid":"30750"},{"courses_uuid":"30752"},{"courses_uuid":"30754"},{"courses_uuid":"30756"},{"courses_uuid":"39485"},{"courses_uuid":"45016"},{"courses_uuid":"45108"},{"courses_uuid":"47872"},{"courses_uuid":"47967"},{"courses_uuid":"53254"},{"courses_uuid":"56357"},{"courses_uuid":"66311"},{"courses_uuid":"66313"},{"courses_uuid":"66315"},{"courses_uuid":"66317"},{"courses_uuid":"73371"},{"courses_uuid":"73373"},{"courses_uuid":"73375"},{"courses_uuid":"73377"},{"courses_uuid":"79527"},{"courses_uuid":"79615"},{"courses_uuid":"83176"},{"courses_uuid":"83178"},{"courses_uuid":"83180"},{"courses_uuid":"83182"},{"courses_uuid":"83577"},{"courses_uuid":"84805"},{"courses_uuid":"84891"},{"courses_uuid":"9415"},{"courses_uuid":"9437"},{"courses_uuid":"9439"},{"courses_uuid":"9441"},{"courses_uuid":"9443"}]}

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out partial name return all yang*", function () {
        var queryTest:QueryRequest = {
            "WHERE":{

                "IS":{
                    "courses_instructor":"yang"
                }

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_uuid"
                ],
                "ORDER":"courses_uuid",
                "FORM":"TABLE"
            }
        }


        var emptyArray:any[] = [];
        var result = { render: 'TABLE',
            result:
                emptyArray
        }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out Firetruck", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_dept":"*i*"
                        }
                    },
                    {
                        "IS":{
                            "courses_id":"69*"
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                ],
                "FORM":"TABLE"
            }
        }


        var emptyArray:any[] = [];
        var result = { render: 'TABLE',
            result:[{"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"hist", "courses_id":"699"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"},
                    {"courses_dept":"mine",	"courses_id":"698"}]

        }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out Firefly Chem", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "IS": {
                        "courses_instructor": "*ee*"
                    }
                },
                    {
                        "IS":{"courses_dept":"chem"}
                    }
            ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_instructor"
                ],
                "ORDER":"courses_instructor",
                "FORM":"TABLE"
            }
        }


        var emptyArray:any[] = [];
        var result = { render: 'TABLE',
            result:[{"courses_instructor":"wheeler, michael"},
                    {"courses_instructor":"wheeler, michael"}]
        }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out Firefly Chem", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND": [{
                    "IS": {
                        "courses_instructor": "*ee*"
                    }
                },
                    {
                        "IS":{"courses_dept":"chem"}
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_instructor"
                ],
                "ORDER":"courses_instructor",
                "FORM":"TABLE"
            }
        }


        var emptyArray:any[] = [];
        var result = { render: 'TABLE',
            result:[{"courses_instructor":"wheeler, michael"},
                {"courses_instructor":"wheeler, michael"}]
        }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out partial name just names", function () {
        var queryTest:QueryRequest = {
            "WHERE":{

                "IS":{
                    "courses_instructor":"*yang*"
                }

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_instructor"
                ],
                "ORDER":"courses_instructor",
                "FORM":"TABLE"
            }
        }

        /** bodolec, jacques;o'brien, juliet;yang, wenyan
         bodolec, jacques;o'brien, juliet;yang, wenyan
         o'brien, juliet;yang, wenyan
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, liqiong
         yang, meng-hsuan
         yang, shuo
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, tsung-yuan
         yang, zeng*/

        var result = { render: 'TABLE',
            result:
                [{courses_instructor:"bodolec, jacques;o'brien, juliet;yang, wenyan"},
        {courses_instructor:"bodolec, jacques;o'brien, juliet;yang, wenyan"},
        {courses_instructor:"o'brien, juliet;yang, wenyan"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, liqiong"},
        {courses_instructor:"yang, meng-hsuan"},
        {courses_instructor:"yang, shuo"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, tsung-yuan"},
        {courses_instructor:"yang, zeng"}]
        }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out complex partial prof name", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"*john*"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"*chem"
                        }
                    },
                    {
                        "LT":{
                            "courses_avg":63
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        // comm	293	63.61	yang, shuo
        /** courses_dept	courses_id	courses_avg	courses_instructor
         chem	313	74.62	sherman, john
         chem	123	74.63	grant, edward;lekhi, priya;love, jennifer ann;sherman, john
         chem	123	75.7	lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john
         chem	313	75.96	sherman, john
         chem	123	77.74	lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john
         chem	123	81.25	johnson, kayli;lindenberg, erin */

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'chem', courses_id: '233', courses_avg: 62.77, courses_instructor: "ruddick, john n r;stewart, jaclyn" }
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

    it("200 testing out complex partial prof name", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"*john"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"*chem"
                        }
                    },
                    {
                        "LT":{
                            "courses_avg":63
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        // comm	293	63.61	yang, shuo
        /** courses_dept	courses_id	courses_avg	courses_instructor
         chem	313	74.62	sherman, john
         chem	123	74.63	grant, edward;lekhi, priya;love, jennifer ann;sherman, john
         chem	123	75.7	lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john
         chem	313	75.96	sherman, john
         chem	123	77.74	lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john
         chem	123	81.25	johnson, kayli;lindenberg, erin */

        var emptyArray:any[] = []
        var result = { render: 'TABLE',
            result:emptyArray }

        return insightFacade.performQuery(queryTest).then(function (value: InsightResponse){
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(result);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"no data matches query"})
        })


    });

    it("200 testing out complex partial prof name middle", function () {
        var queryTest:QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"*john*"
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"*chem"
                        }
                    },
                    {
                        "GT":{
                            "courses_avg":74
                        }
                    }
                ]

            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        // comm	293	63.61	yang, shuo
        /** courses_dept	courses_id	courses_avg	courses_instructor
         chem	313	74.62	sherman, john
         chem	123	74.63	grant, edward;lekhi, priya;love, jennifer ann;sherman, john
         chem	123	75.7	lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john
         chem	313	75.96	sherman, john
         chem	123	77.74	lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john
         chem	123	81.25	johnson, kayli;lindenberg, erin */

        var result = { render: 'TABLE',
            result:
                [ { courses_dept: 'chem', courses_id: '313', courses_avg: 74.62, courses_instructor: "sherman, john" },
                    { courses_dept: 'chem', courses_id: '123', courses_avg: 74.63, courses_instructor: "grant, edward;lekhi, priya;love, jennifer ann;sherman, john" },
                    { courses_dept: 'chem', courses_id: '123', courses_avg: 75.7, courses_instructor: "lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john" },
                    { courses_dept: 'chem', courses_id: '313', courses_avg: 75.96, courses_instructor: "sherman, john" },
                    { courses_dept: 'chem', courses_id: '123', courses_avg: 77.74, courses_instructor: "lekhi, priya;love, jennifer ann;macfarlane, william andrew;patey, grenfell;sherman, john" },
                    { courses_dept: 'chem', courses_id: '123', courses_avg: 81.25, courses_instructor: "johnson, kayli;lindenberg, erin" }
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
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });

    it("200 testing out order missing", function () {
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
            //console.time("deep equal time")
            expect(value.body).to.deep.equal(result);
            //console.timeEnd("deep equal time")
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.deep.equal({"error":"invalid query"})
        })


    });




});
