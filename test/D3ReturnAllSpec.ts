/**
 * Created by johnz on 2017-03-09.
 */
/**
 * Created by johnz on 2017-03-08.
 */
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade, FilterQuery, MCompare} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


describe("D3ReturnAllSpec", function () {

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

    it.skip("200 testing returning all new order no transformation", function () {

        var queryTest: QueryRequest =  {
            "WHERE": {

            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_fullname", "rooms_seats"]
                },
                "FORM": "TABLE"
            }
        }

        var result =
            {"render":"TABLE","result":[{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":503},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":181},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":120},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":120},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":120},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":88},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":30},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":30},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":21},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":16},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":14},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":12},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":12},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":10},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":10},{"rooms_fullname":"Woodward (Instructional Resources Centre-IRC)","rooms_seats":10},{"rooms_fullname":"West Mall Swing Space","rooms_seats":190},{"rooms_fullname":"West Mall Swing Space","rooms_seats":190},{"rooms_fullname":"West Mall Swing Space","rooms_seats":188},{"rooms_fullname":"West Mall Swing Space","rooms_seats":187},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":47},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"West Mall Swing Space","rooms_seats":27},{"rooms_fullname":"Wesbrook","rooms_seats":325},{"rooms_fullname":"Wesbrook","rooms_seats":102},{"rooms_fullname":"War Memorial Gymnasium","rooms_seats":40},{"rooms_fullname":"War Memorial Gymnasium","rooms_seats":25},{"rooms_fullname":"The Leon and Thea Koerner University Centre","rooms_seats":55},{"rooms_fullname":"The Leon and Thea Koerner University Centre","rooms_seats":48},{"rooms_fullname":"The Leon and Thea Koerner University Centre","rooms_seats":30},{"rooms_fullname":"The Leon and Thea Koerner University Centre","rooms_seats":30},{"rooms_fullname":"Student Recreation Centre","rooms_seats":299},{"rooms_fullname":"Student Recreation Centre","rooms_seats":299},{"rooms_fullname":"Student Recreation Centre","rooms_seats":299},{"rooms_fullname":"School of Population and Public Health","rooms_seats":66},{"rooms_fullname":"School of Population and Public Health","rooms_seats":30},{"rooms_fullname":"School of Population and Public Health","rooms_seats":28},{"rooms_fullname":"School of Population and Public Health","rooms_seats":16},{"rooms_fullname":"School of Population and Public Health","rooms_seats":14},{"rooms_fullname":"School of Population and Public Health","rooms_seats":12},{"rooms_fullname":"Robert F. Osborne Centre","rooms_seats":442},{"rooms_fullname":"Robert F. Osborne Centre","rooms_seats":40},{"rooms_fullname":"Robert F. Osborne Centre","rooms_seats":39},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":40},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":40},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":40},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":24},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":24},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":24},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":24},{"rooms_fullname":"Ponderosa Commons: Oak House","rooms_seats":24},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":236},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":167},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":72},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":14},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Pharmaceutical Sciences Building","rooms_seats":7},{"rooms_fullname":"Orchard Commons","rooms_seats":72},{"rooms_fullname":"Orchard Commons","rooms_seats":72},{"rooms_fullname":"Orchard Commons","rooms_seats":72},{"rooms_fullname":"Orchard Commons","rooms_seats":48},{"rooms_fullname":"Orchard Commons","rooms_seats":48},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":25},{"rooms_fullname":"Orchard Commons","rooms_seats":20},{"rooms_fullname":"Orchard Commons","rooms_seats":16},{"rooms_fullname":"Orchard Commons","rooms_seats":16},{"rooms_fullname":"Orchard Commons","rooms_seats":16},{"rooms_fullname":"Orchard Commons","rooms_seats":16},{"rooms_fullname":"Orchard Commons","rooms_seats":16},{"rooms_fullname":"Neville Scarfe","rooms_seats":280},{"rooms_fullname":"Neville Scarfe","rooms_seats":60},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":40},{"rooms_fullname":"Neville Scarfe","rooms_seats":38},{"rooms_fullname":"Neville Scarfe","rooms_seats":34},{"rooms_fullname":"Neville Scarfe","rooms_seats":24},{"rooms_fullname":"Neville Scarfe","rooms_seats":24},{"rooms_fullname":"Neville Scarfe","rooms_seats":24},{"rooms_fullname":"Neville Scarfe","rooms_seats":20},{"rooms_fullname":"Neville Scarfe","rooms_seats":20},{"rooms_fullname":"Neville Scarfe","rooms_seats":20},{"rooms_fullname":"Neville Scarfe","rooms_seats":20},{"rooms_fullname":"Mathematics Annex","rooms_seats":106},{"rooms_fullname":"Mathematics","rooms_seats":224},{"rooms_fullname":"Mathematics","rooms_seats":60},{"rooms_fullname":"Mathematics","rooms_seats":48},{"rooms_fullname":"Mathematics","rooms_seats":48},{"rooms_fullname":"Mathematics","rooms_seats":30},{"rooms_fullname":"Mathematics","rooms_seats":30},{"rooms_fullname":"Mathematics","rooms_seats":30},{"rooms_fullname":"Mathematics","rooms_seats":25},{"rooms_fullname":"MacMillan","rooms_seats":200},{"rooms_fullname":"MacMillan","rooms_seats":74},{"rooms_fullname":"MacMillan","rooms_seats":72},{"rooms_fullname":"MacMillan","rooms_seats":47},{"rooms_fullname":"MacMillan","rooms_seats":32},{"rooms_fullname":"MacMillan","rooms_seats":32},{"rooms_fullname":"MacMillan","rooms_seats":24},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":8},{"rooms_fullname":"MacMillan","rooms_seats":6},{"rooms_fullname":"MacMillan","rooms_seats":6},{"rooms_fullname":"MacLeod","rooms_seats":136},{"rooms_fullname":"MacLeod","rooms_seats":123},{"rooms_fullname":"MacLeod","rooms_seats":84},{"rooms_fullname":"MacLeod","rooms_seats":60},{"rooms_fullname":"MacLeod","rooms_seats":60},{"rooms_fullname":"MacLeod","rooms_seats":40},{"rooms_fullname":"Life Sciences Centre","rooms_seats":350},{"rooms_fullname":"Life Sciences Centre","rooms_seats":350},{"rooms_fullname":"Life Sciences Centre","rooms_seats":125},{"rooms_fullname":"Leonard S. Klinck (also known as CSCI)","rooms_seats":205},{"rooms_fullname":"Leonard S. Klinck (also known as CSCI)","rooms_seats":183},{"rooms_fullname":"Leonard S. Klinck (also known as CSCI)","rooms_seats":75},{"rooms_fullname":"Leonard S. Klinck (also known as CSCI)","rooms_seats":42},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":68},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":31},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":29},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":29},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":16},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":16},{"rooms_fullname":"Jack Bell Building for the School of Social Work","rooms_seats":12},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":154},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":112},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":50},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":40},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":30},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":24},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":24},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":24},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":24},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":16},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":12},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":10},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":8},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":8},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":8},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":8},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":8},{"rooms_fullname":"Irving K Barber Learning Centre","rooms_seats":8},{"rooms_fullname":"Iona Building","rooms_seats":100},{"rooms_fullname":"Iona Building","rooms_seats":50},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_seats":160},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_seats":120},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_seats":80},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_seats":40},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_seats":40},{"rooms_fullname":"Henry Angus","rooms_seats":260},{"rooms_fullname":"Henry Angus","rooms_seats":80},{"rooms_fullname":"Henry Angus","rooms_seats":70},{"rooms_fullname":"Henry Angus","rooms_seats":70},{"rooms_fullname":"Henry Angus","rooms_seats":68},{"rooms_fullname":"Henry Angus","rooms_seats":68},{"rooms_fullname":"Henry Angus","rooms_seats":68},{"rooms_fullname":"Henry Angus","rooms_seats":60},{"rooms_fullname":"Henry Angus","rooms_seats":60},{"rooms_fullname":"Henry Angus","rooms_seats":58},{"rooms_fullname":"Henry Angus","rooms_seats":54},{"rooms_fullname":"Henry Angus","rooms_seats":54},{"rooms_fullname":"Henry Angus","rooms_seats":54},{"rooms_fullname":"Henry Angus","rooms_seats":54},{"rooms_fullname":"Henry Angus","rooms_seats":53},{"rooms_fullname":"Henry Angus","rooms_seats":44},{"rooms_fullname":"Henry Angus","rooms_seats":44},{"rooms_fullname":"Henry Angus","rooms_seats":41},{"rooms_fullname":"Henry Angus","rooms_seats":41},{"rooms_fullname":"Henry Angus","rooms_seats":41},{"rooms_fullname":"Henry Angus","rooms_seats":37},{"rooms_fullname":"Henry Angus","rooms_seats":35},{"rooms_fullname":"Henry Angus","rooms_seats":32},{"rooms_fullname":"Henry Angus","rooms_seats":32},{"rooms_fullname":"Henry Angus","rooms_seats":20},{"rooms_fullname":"Henry Angus","rooms_seats":16},{"rooms_fullname":"Henry Angus","rooms_seats":16},{"rooms_fullname":"Henry Angus","rooms_seats":16},{"rooms_fullname":"Hennings","rooms_seats":257},{"rooms_fullname":"Hennings","rooms_seats":155},{"rooms_fullname":"Hennings","rooms_seats":150},{"rooms_fullname":"Hennings","rooms_seats":36},{"rooms_fullname":"Hennings","rooms_seats":30},{"rooms_fullname":"Hennings","rooms_seats":30},{"rooms_fullname":"Hebb","rooms_seats":375},{"rooms_fullname":"Hebb","rooms_seats":54},{"rooms_fullname":"Hebb","rooms_seats":54},{"rooms_fullname":"Hebb","rooms_seats":54},{"rooms_fullname":"Geography","rooms_seats":225},{"rooms_fullname":"Geography","rooms_seats":100},{"rooms_fullname":"Geography","rooms_seats":72},{"rooms_fullname":"Geography","rooms_seats":60},{"rooms_fullname":"Geography","rooms_seats":60},{"rooms_fullname":"Geography","rooms_seats":42},{"rooms_fullname":"Geography","rooms_seats":39},{"rooms_fullname":"Geography","rooms_seats":21},{"rooms_fullname":"Friedman Building","rooms_seats":160},{"rooms_fullname":"Frederic Lasserre","rooms_seats":94},{"rooms_fullname":"Frederic Lasserre","rooms_seats":80},{"rooms_fullname":"Frederic Lasserre","rooms_seats":60},{"rooms_fullname":"Frederic Lasserre","rooms_seats":51},{"rooms_fullname":"Frederic Lasserre","rooms_seats":20},{"rooms_fullname":"Frederic Lasserre","rooms_seats":20},{"rooms_fullname":"Frank Forward","rooms_seats":63},{"rooms_fullname":"Frank Forward","rooms_seats":44},{"rooms_fullname":"Frank Forward","rooms_seats":35},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":250},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":99},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":65},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":65},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":36},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":24},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":24},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":20},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":20},{"rooms_fullname":"Forest Sciences Centre","rooms_seats":18},{"rooms_fullname":"Food, Nutrition and Health","rooms_seats":99},{"rooms_fullname":"Food, Nutrition and Health","rooms_seats":54},{"rooms_fullname":"Food, Nutrition and Health","rooms_seats":43},{"rooms_fullname":"Food, Nutrition and Health","rooms_seats":28},{"rooms_fullname":"Food, Nutrition and Health","rooms_seats":27},{"rooms_fullname":"Food, Nutrition and Health","rooms_seats":12},{"rooms_fullname":"Earth and Ocean Sciences - Main","rooms_seats":50},{"rooms_fullname":"Earth Sciences Building","rooms_seats":350},{"rooms_fullname":"Earth Sciences Building","rooms_seats":150},{"rooms_fullname":"Earth Sciences Building","rooms_seats":80},{"rooms_fullname":"Civil and Mechanical Engineering","rooms_seats":100},{"rooms_fullname":"Civil and Mechanical Engineering","rooms_seats":62},{"rooms_fullname":"Civil and Mechanical Engineering","rooms_seats":45},{"rooms_fullname":"Civil and Mechanical Engineering","rooms_seats":34},{"rooms_fullname":"Civil and Mechanical Engineering","rooms_seats":26},{"rooms_fullname":"Civil and Mechanical Engineering","rooms_seats":22},{"rooms_fullname":"Chemistry","rooms_seats":265},{"rooms_fullname":"Chemistry","rooms_seats":240},{"rooms_fullname":"Chemistry","rooms_seats":114},{"rooms_fullname":"Chemistry","rooms_seats":114},{"rooms_fullname":"Chemistry","rooms_seats":90},{"rooms_fullname":"Chemistry","rooms_seats":90},{"rooms_fullname":"Chemical and Biological Engineering Building","rooms_seats":200},{"rooms_fullname":"Chemical and Biological Engineering Building","rooms_seats":94},{"rooms_fullname":"Chemical and Biological Engineering Building","rooms_seats":60},{"rooms_fullname":"Centre for Interactive  Research on Sustainability","rooms_seats":426},{"rooms_fullname":"Buchanan","rooms_seats":275},{"rooms_fullname":"Buchanan","rooms_seats":181},{"rooms_fullname":"Buchanan","rooms_seats":150},{"rooms_fullname":"Buchanan","rooms_seats":150},{"rooms_fullname":"Buchanan","rooms_seats":131},{"rooms_fullname":"Buchanan","rooms_seats":108},{"rooms_fullname":"Buchanan","rooms_seats":108},{"rooms_fullname":"Buchanan","rooms_seats":78},{"rooms_fullname":"Buchanan","rooms_seats":78},{"rooms_fullname":"Buchanan","rooms_seats":78},{"rooms_fullname":"Buchanan","rooms_seats":78},{"rooms_fullname":"Buchanan","rooms_seats":65},{"rooms_fullname":"Buchanan","rooms_seats":65},{"rooms_fullname":"Buchanan","rooms_seats":65},{"rooms_fullname":"Buchanan","rooms_seats":65},{"rooms_fullname":"Buchanan","rooms_seats":56},{"rooms_fullname":"Buchanan","rooms_seats":50},{"rooms_fullname":"Buchanan","rooms_seats":50},{"rooms_fullname":"Buchanan","rooms_seats":50},{"rooms_fullname":"Buchanan","rooms_seats":48},{"rooms_fullname":"Buchanan","rooms_seats":42},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":40},{"rooms_fullname":"Buchanan","rooms_seats":32},{"rooms_fullname":"Buchanan","rooms_seats":32},{"rooms_fullname":"Buchanan","rooms_seats":32},{"rooms_fullname":"Buchanan","rooms_seats":32},{"rooms_fullname":"Buchanan","rooms_seats":32},{"rooms_fullname":"Buchanan","rooms_seats":32},{"rooms_fullname":"Buchanan","rooms_seats":31},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":30},{"rooms_fullname":"Buchanan","rooms_seats":26},{"rooms_fullname":"Buchanan","rooms_seats":24},{"rooms_fullname":"Buchanan","rooms_seats":24},{"rooms_fullname":"Buchanan","rooms_seats":24},{"rooms_fullname":"Buchanan","rooms_seats":24},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":22},{"rooms_fullname":"Buchanan","rooms_seats":18},{"rooms_fullname":"Brock Hall Annex","rooms_seats":70},{"rooms_fullname":"Brock Hall Annex","rooms_seats":24},{"rooms_fullname":"Biological Sciences","rooms_seats":228},{"rooms_fullname":"Biological Sciences","rooms_seats":76},{"rooms_fullname":"Biological Sciences","rooms_seats":16},{"rooms_fullname":"Biological Sciences","rooms_seats":16},{"rooms_fullname":"Auditorium Annex","rooms_seats":21},{"rooms_fullname":"Auditorium Annex","rooms_seats":20},{"rooms_fullname":"Aquatic Ecosystems Research Laboratory","rooms_seats":144},{"rooms_fullname":"Anthropology and Sociology","rooms_seats":90},{"rooms_fullname":"Anthropology and Sociology","rooms_seats":37},{"rooms_fullname":"Anthropology and Sociology","rooms_seats":33},{"rooms_fullname":"Anthropology and Sociology","rooms_seats":26},{"rooms_fullname":"Allard Hall (LAW)","rooms_seats":94},{"rooms_fullname":"Allard Hall (LAW)","rooms_seats":50},{"rooms_fullname":"Allard Hall (LAW)","rooms_seats":44},{"rooms_fullname":"Allard Hall (LAW)","rooms_seats":20},{"rooms_fullname":"Allard Hall (LAW)","rooms_seats":20}]}

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

            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })




    });

    it.skip("200 testing returning all new order no transformation", function () {

        var queryTest: QueryRequest =  {
            "WHERE": {

            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_fullname", "rooms_seats"]
                },
                "FORM": "TABLE"
            }
        }

        var result ={}

        return insightFacade.performQuery(queryTest).then(function (value: any) {
            Log.info(JSON.stringify(value.body));
            expect(value.code).to.equal(200);
            var resultKey:any = value.body["result"]
            var expectedResult:any = result;
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

            expect(err.code).to.equal(424);
            expect(err.body).to.deep.equal({"error": "invalid query"})

        })




    });


});