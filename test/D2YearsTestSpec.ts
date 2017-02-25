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
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        }

        var result = {"render":"TABLE","result":[{"courses_dept":"math","courses_year":2016,"courses_uuid":"32014","courses_avg":97.25}]}

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