/**
 * Created by paull on 10/2/2017.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("D2CampusTest", function () {

    var insight: InsightFacade= null;

    beforeEach(function() {
        insight = new InsightFacade();
    });

    afterEach(function() {
        insight = null;
    });

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    const fs = require('fs');
    it("204: addDataset should add a dataset to UBCInsight (D2)", function () {

        return insight.addDataset('D2testInsight',fs.readFileSync('rooms.zip').toString('base64')).then(function (value: InsightResponse) {
            //var ir: InsightResponse;
            //sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal({});
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect.fail();//should check the same name within the respairatory
        })

    });

    it("204: initialize for us (D2)", function () {

        return insight.addDataset('D2courses',fs.readFileSync('rooms.zip').toString('base64')).then(function (value: InsightResponse) {

            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({});
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect.fail();//should check the same name within the respairatory
        })

    });
    //my thing flipped (204 and 201 flipped)

    it("201: addDataset should add a dataset to UBCInsight (D2)", function () {


        fs.writeFile('D2VirtualInsight', '{}', (err: Error) => {
            if (err) throw err;
        });
        /*fs.writeFile('existingIds_Don\'tMakeAnotherIdOfThisFileName', 'VirtualInsight' + "\r\n", (err: Error) => {
         if (err) throw err;
         });*/
        //insight.addDataset('VirtualInsight',fs.readFileSync('courses.zip').toString('base64'));
        return insight.addDataset('D2VirtualInsight',fs.readFileSync('rooms.zip').toString('base64')).then(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(201);
            expect(value.body).to.deep.equal({});
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect.fail();
        })

    });

    it("400: addDataset should reject dataset with no table", function () {
        return insight.addDataset('D2supposetounparse',fs.readFileSync('noTableCampus.zip').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({'error': 'cannot set a valid zip that does not contain any real data.'});
        })

    });
    it("400: addDataset should reject dataset excluded from index", function () {
        return insight.addDataset('D2supposetounparse',fs.readFileSync('notInIndex.zip').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({'error': 'cannot set a valid zip that does not contain any real data.'});
        })

    });
    /*it("Irongate: Adding a dataset with the wrong id should give 400 (rooms)", function () {
        return insight.addDataset('rooms',fs.readFileSync('courses.zip').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({'error': 'illegal attempt to add dataset with the wrong id.'});
        })

    });
    it("Irongate: Adding a dataset with the wrong id should give 400 (courses)", function () {
        return insight.addDataset('courses',fs.readFileSync('rooms.zip').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({'error': 'illegal attempt to add dataset with the wrong id.'});
        })

    });*/

/*
    it("400: addDataset should detect non-real data files (e.g., Array, invalid JSON, etc.)", function () {
        return insight.addDataset('D1supposetounparse',fs.readFileSync('unparsable_json.zip').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({'error': 'cannot set a valid zip that does not contain any real data.'});
        })

    });

    it("400/Bender: addDataset should detect empty zip", function () {
        return insight.addDataset('D1supposetoempty',fs.readFileSync('empty_zip.zip').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            expect(value.body).to.deep.equal({'error': 'no datafile is found'});
        })

    });
    it("204: addDataset should add a dataset to UBCInsight and dump the invalid one", function () {
        return insight.addDataset('1json1not',fs.readFileSync('1unparsable1parsable.zip').toString('base64')).then(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            //Log.test(JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({});
        }).catch(function (err) {
            //Log.test('Error: ' + err);
            expect.fail();//should check the same name within the respairatory
        })

    });
*/

    //TODO: removeDataset
/*
    var JSZip = require('jszip');
    var zip = new JSZip();
    it("204: removeDataset should remove the dataset", function () {
        return insight.removeDataset('testInsight').then(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            Log.test(JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();//should check the same name within the respairatory
        })

    });

    it("404: removeDataset cannot find the added source", function () {
        return insight.removeDataset('testInsight').then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            Log.test(JSON.stringify(value));
            expect(value.code).to.equal(404);
            expect(value.body).to.deep.equal({'error': 'delete was a resource that was not previously added'});
        })

    });

    it("BigFish: Should not be able to set a dataset that is not a zip file", function () {
        return insight.addDataset('VirtualInsight',fs.readFileSync('VirtualInsight').toString('base64')).then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            var ir: InsightResponse;
            sanityCheck(value);
            Log.test(JSON.stringify(value));
            expect(value.code).to.equal(400);
            //expect(value.body).to.deep.equal({'Error': 'Delete was a resource that was not previously added'});
        })
    });


*/
    //ask them about: same name but diff format
    //why's the file produced in spite of having reject statements in front <-- asynchronous
    //courses.zip file will be in diff directory for the user, so it doesn't matter

});

