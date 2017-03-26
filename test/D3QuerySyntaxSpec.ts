import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade, FilterQuery, MCompare} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


describe("D3QuerySyntaxSpec", function () {

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
        //return insight.addDataset('courses', fs.readFileSync('courses.zip').toString('base64'))
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
        //return insight.removeDataset('courses');
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        //return insight.removeDataset('courses');


    });

    /**rooms_fullname: string; Full building name (e.g., "Hugh Dempster Pavilion").
     rooms_shortname: string; Short building name (e.g., "DMP").
     rooms_number: string; The room number. Not always a number, so represented as a string.
     rooms_name: string; The room id; should be rooms_shortname+"_"+rooms_number.
     rooms_address: string; The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
     rooms_lat: number; The latitude of the building. Instructions for getting this field are below.
     rooms_lon: number; The longitude of the building. Instructions for getting this field are below.
     rooms_seats: number; The number of seats in the room.
     rooms_type: string; The room type (e.g., "Small Group").
     rooms_furniture: string; The room type (e.g., "Classroom-Movable Tables & Chairs").
     rooms_href: string; The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").*/


    it.only("testing out simple query provided in deliverable", function () {
        var queryTest: any = {
            "WHERE": {
                "NOT": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_fullname": "something"
                            }
                        },
                        {
                            "IS": {
                                "rooms_shortname": "short something"
                            }
                        },
                        {
                            "IS": {
                                "rooms_number": "20"
                            }
                        },

                        {
                            "IS": {
                                "rooms_name": "short something 20"
                            }
                        },
                        {
                            "IS": {
                                "rooms_address": "address 123%^*()"
                            }
                        },
                        {
                            "LT": {
                                "rooms_lat": -123
                            }
                        },
                        {
                            "GT": {
                                "rooms_lon": -123.24809
                            }
                        },
                        {
                            "GT": {
                                "rooms_seats": 20
                            }
                        },
                        {
                            "IS": {
                                "rooms_type": "type something"
                            }
                        },
                        {
                            "IS": {
                                "rooms_furniture": "furniture something"
                            }
                        },
                        {
                            "IS": {
                                "rooms_href": "something something href"
                            }
                        }
                    ]
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_href",
                    "rooms_seats"
                ],
                "ORDER": "rooms_href",
                "FORM": "TABLE"
            }
        }

        var keyTest = Object.keys(queryTest);
        var result = {"true": ["courses"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(false);


    });

    it("isValid old ORDER with TRANSFORMATION", function () {
        var queryTest: any =  {
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
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["rooms"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("isValid new ORDER without TRANSFORMATION", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "rooms_shortname",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_furniture", "rooms_shortname"]
                },
                "FORM": "TABLE"
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["rooms"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("isValid new ORDER with TRANSFORMATION", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "rooms_shortname",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_furniture", "rooms_shortname"]
                },
                "FORM": "TABLE"
            }, "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture", "rooms_shortname", "rooms_seats"],
                "APPLY": []
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["rooms"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("isValid new ORDER with TRANSFORMATION", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "rooms_shortname",
                    "stuffytest"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_furniture", "rooms_shortname"]
                },
                "FORM": "TABLE"
            }, "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture", "rooms_shortname", "rooms_seats", "rooms_href"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                },{
                    "stuffytest": {
                        "COUNT": "rooms_seats"
                    }
                }]
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["rooms"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("isValid no ORDER with TRANSFORMATION", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture",
                    "rooms_shortname",
                    "stuffytest"
                ],
                "FORM": "TABLE"
            }, "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture", "rooms_shortname", "rooms_seats", "rooms_href"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                },{
                    "stuffytest": {
                        "COUNT": "rooms_seats"
                    }
                }]
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["rooms"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it("isValid mixed Columns, weird ORDER with TRANSFORMATION", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid", "minGrade"
                ],
                "ORDER": "minGrade",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_uuid"],
                "APPLY": [
                    {
                        "minGrade": {
                            "SUM": "courses_avg"
                        }
                    }
                ]
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["courses"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(result);


    });

    it.only("400 isValid with apply with underscore", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid", "minGrade"
                ],
                "ORDER": "minGrade",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["minGrade"],
                "APPLY": [
                    {
                        "minGrade": {
                            "SUM": "courses_avg"
                        }
                    },
                    {
                        "testthings": {
                            "COUNT": "courses_avg"
                        }
                    }
                ]
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["courses"]}
        sanityCheck(queryTest);
        expect(insightFacade.isValid(queryTest)).to.deep.equal(false);


    });

    it.only("400 new order with unknown key", function () {
        var queryTest: any =  {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid", "minGrade"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_uuid"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP":["courses_uuid"],
                "APPLY": [
                    {
                        "minGrade": {
                            "MIN": "courses_avg"
                        }
                    },
                    {
                        "minGrade": {
                            "MIN": "courses_avg"
                        }
                    }
                ]
            }
        }
        var keyTest = Object.keys(queryTest);
        var result = {"true": ["courses"]}
        sanityCheck(queryTest);
        Log.info(insightFacade.isValid(queryTest))
        expect(insightFacade.isValid(queryTest)).to.deep.equal(false);


    });






});