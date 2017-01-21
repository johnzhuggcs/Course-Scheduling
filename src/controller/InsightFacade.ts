/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }
//addDataset("courses",
    addDataset(id: string, content: string): Promise<InsightResponse> {
        /**
         * TODO: Add a dataset to UBCInsight.
         *
         * @param id  The id of the dataset being added.
         * @param content  The base64 content of the dataset. This content should be in the
         * form of a serialized zip file.
         *
         * //Store the file into a base64 content
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


        var zip = new JSZip;
        zip.file(id,content);

        //id: stuff I want to add to
        //content: stuff I want to extract
        return new Promise (function (fulfill,reject) {

            //Process 2
            //open the zip file
            //for loop (check the id of the files within the zip file)
            //if the zip file includes the file
            //

            var rp = require('request-promise-native');

            rp(id,content)
                .then(function (id: string,content: any) {

                    try {
                        var parsedJSON = JSON.parse(content)
                    }
                    catch (error: Error) {
                        error = new Error('Error: Could not parse JSON');
                        reject(400);
                    }

                    if (/*operation successful &&*/  content.includes(id))
                    {
                        fulfill(201);
                    }

                    if (/*operation successful &&*/ !content.includes(id)) {
                        fulfill(204);
                    }

                    if (/*operation failed &&*/) {
                        reject(400);
                    }
                })
                .catch(function (err: Error) {
                    err = new Error('Error: JSON file could not be retrieved');
                    reject(400);
            })

            })
        //Add Code
    }

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
}
