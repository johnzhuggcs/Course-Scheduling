/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    //addDataset(
//addDataset("courses",
    addDataset(id: string, content: string): Promise<InsightResponse> {
        /**
         * TODO: Add a dataset to UBCInsight.
         *
         * @param id  The id of the dataset being added.
         * @param content  The base64 content of the dataset. This content should be in the
         * form of a serialized zip file.
         *
         *
         * TODO: The promise should return an InsightResponse for both fulfill and reject.
         *
         * TODO: Fulfill should be for 2XX codes and reject for everything else.
         * ^should be returning the code instead
         * if (fileName == "n number of string"2XX"n number of string") {
         *
         * }
         *
         * TODO: After receiving the dataset, it should be processed into a data structure of
         * TODO: your design. The processed data structure should be persisted to disk; your
         * TODO: system should be able to load this persisted value into memory for answering
         * TODO: queries.
         *
         * TODO: Ultimately, a dataset must be added or loaded from disk before queries can
         * TODO: be successfully answered.
         *
         * TODO: Response codes:
         *
         * TODO: 201: the operation was successful and the id already existed (was added in
         * TODO: this session or was previously cached).
         * TODO: 204: the operation was successful and the id was new (not added in this
         * TODO: session or was previously cached).
         * TODO: 400: the operation failed. The body should contain {"error": "my text"}
         * TODO: to explain what went wrong.
         *
         */


        //var zip = new JSZip;
        //zip.file(id,content);

        //id: stuff I want to add to
        //content: stuff I want to extract
        return new Promise (function (fulfill,reject) {

            //Process 2
            //open the zip file
            //for loop (check the id of the files within the zip file)
            //if the zip file includes the file
            //

            //rp is for server, so it's unnecessary

            //var rp = require('request-promise-native');
            var request = require('request');
            var JSZip = require('jszip');
            var fs = require('fs'); //use this in the test too
            var zip = new JSZip();
            var arrayOfId: string[] = [];
            var arrayOfJsonPromise: any = [];

            var filesNotJsonCounter = 0;
            var noOfFiles = 0;

            Log.info("can pass through 0");

                        //zip.file(id,content);
            zip.loadAsync(content).then(function (zip: any) {
                //for (let x in zip) {

                zip.folder(content).forEach(function (relativePath: any, file: any) {

                    //for each file within the zip, create a promise
                    //use promise for async
                    //if successful, a new folder will be created in cpsc310project_team45 which includes the name
                    var p = new Promise((fulfillfile, rejectfile) => {

                        Log.info("each p1 is loaded");
                        noOfFiles++;

                        try {
                            var parsedJSON = JSON.parse(file);
                            fulfillfile(parsedJSON); //this is just for fulfilling the inner promise
                        }
                        catch (err) {
                            filesNotJsonCounter++;
                            rejectfile("can't parse");
                            //var ir2: InsightResponse = {code: 400, body: {'error': 'Could not parse JSON'}};
                            /*ir2.code = 400;
                             ir2.body = {'error': 'Could not parse JSON'};*/
                            //err = new Error('Error: Could not parse JSON');
                            //Log.info("Code is:" + String(ir2.code));

                            //reject(ir2);
                            //if nothing valid: throw 400
                        }

                        Log.info("typeofzip:" + typeof file.getId);
                    });
                    arrayOfJsonPromise.push(p);
                });
                // }

                arrayOfId.push(id);
                Log.info("arrayOfJsonPromises:" + arrayOfJsonPromise);
                /*Promise.all(arrayOfJsonPromise).then(jsonPromises => {
                    Log.info("each p2 is loaded");
                    var isWritten:boolean;
                    if (filesNotJsonCounter == noOfFiles) {
                        var ir2: InsightResponse = {code: 400, body: {'error': 'Could not parse JSON'}};
                        reject(ir2);
                    }

                    var noOfPromisesStored = 0;
                    for (let i in jsonPromises) {
                        fs.writeFileSync(id, jsonPromises[i]);
                        Log.info("value: " + jsonPromises[i]);
                        noOfPromisesStored++;
                    }
                    if (noOfPromisesStored == arrayOfJsonPromise.size) {
                        var ir4: InsightResponse = {code: 204, body: {}};
                        fulfill(ir4);
                        Log.info("Code is:" + String(ir4.code));
                    }


                    //fulfill(totalvalue);

                    //TODO: Someone said put promise.all to cover up the rest of the functions
                    //TODO: but it's wrong yet, re-verify it/post it in Piaza
                });*/
            });

            //all the files pushed to the promise array will be stored in the file named as 'id'

            //use fs.write to write each file to the actual text file --> store data

            //Log.info("arrayOfJsonPromises:" + arrayOfJsonPromise);
            /*Promise.all(arrayOfJsonPromise).then(jsonPromises => {
                Log.info("each p2 is loaded");
                var isWritten:boolean;
                if (filesNotJsonCounter == noOfFiles) {
                    var ir2: InsightResponse = {code: 400, body: {'error': 'Could not parse JSON'}};
                    reject(ir2);
                }

                var noOfPromisesStored = 0;
                for (let i in jsonPromises) {
                    fs.writeFileSync(id, jsonPromises[i]);
                    Log.info("value: " + jsonPromises[i]);
                    noOfPromisesStored++;
                }
                if (noOfPromisesStored == arrayOfJsonPromise.size) {
                    var ir4: InsightResponse = {code: 204, body: {}};
                    fulfill(ir4);
                    Log.info("Code is:" + String(ir4.code));
                }


                //fulfill(totalvalue);

                //TODO: Someone said put promise.all to cover up the rest of the functions
                //TODO: but it's wrong yet, re-verify it/post it in Piaza
            });*/


            /*if (arrayOfId.includes(id)) {
                var ir3: InsightResponse = {code: 201, body: {}};
                Log.info("Code is:" + String(ir3.code));
                fulfill(ir3);
            }*/

            //if id existed, rename it and inform others about it

        });/*
         .catch(function (err: Error) {
         err = new Error('Error: JSON file could not be retrieved');
         //reject(401);
         });*/
        //Add Code
    }

    //TODO: Helper/testing function 1
    readfile() {}

    removeDataset(id: string): Promise<InsightResponse> {
        //adding code
        //testing
        //to
        //line
        //24
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        //perform query

        return null;
        //perform query

    }

    isValid(query:QueryRequest):boolean{
        return false;

    }}
