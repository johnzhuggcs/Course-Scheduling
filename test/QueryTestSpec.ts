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
    var testInvalidKeys:string[] = [];
    function sanityCheck(response: QueryRequest) {
        expect(response).to.have.property('WHERE');
        expect(response).to.have.property('OPTIONS');

        //expect(response.WHERE).to.be.a("FilterQuery");
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);

    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightFacade = new InsightFacade();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        insightFacade = null;
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
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
                                    "course_avg":90
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



});
