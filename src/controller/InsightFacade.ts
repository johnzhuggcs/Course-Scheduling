/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest, FilterQuery} from "./IInsightFacade";

import Log from "../Util";
import {isString} from "util";
import {isNumber} from "util";

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
                    catch (err) {
                        err = new Error('Error: Could not parse JSON');
                        reject(400);
                    }

                    if (/*operation successful &&*/  content.includes(id))
                    {
                        fulfill(201);
                    }

                    if (/*operation successful &&*/ !content.includes(id)) {
                        fulfill(204);
                    }

                    if (0/*operation failed &&*/) {
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

    isValid(query:QueryRequest):boolean{
        //checks for query provided is of valid syntax
        var checked;
        var keyArray = Object.keys(query); //an array of the keys, should only be WHERE and OPTIONS now
        var Where    //returns WHERE
        var Options; //returns OPTIONS
        var filter;  //returns value of FILTER
        var optionsValue; //returns value of OPTIONS
        var columnsEtcKey; //returns values including and after COLUMNS
        var columnsValidKeyArray; //returns the array of Valid Keys assigned to COLUMNS
        var orderValidKey; //returns the single valid key assigned to ORDER
        var Table; //returns TABLE from VIEW
        if(keyArray[0] == "WHERE" && keyArray[1] == "OPTIONS"){ //checks if outermost keys are WHERE and OPTIONS

                Where = keyArray[0]; //gets "WHERE"
                Options = keyArray[1]; //gets"OPTIONS"
                filter = query[Where]; //returns content of FILTER


                if(this.hasFilter(filter) != false) { //check if FILTER is valid, needed as FILTER is recursively nested
                    optionsValue = query[Options];
                    columnsEtcKey = Object.keys(optionsValue);
                    if(columnsEtcKey.length == 3 && columnsEtcKey[0] == "COLUMNS" && columnsEtcKey[1] == "ORDER" && columnsEtcKey[2] == "FORM"){
                        columnsValidKeyArray = optionsValue[columnsEtcKey[0]]
                        for(let x in columnsValidKeyArray){
                            if(columnsValidKeyArray[x] == "courses_dept" || columnsValidKeyArray[x] == "courses_id"
                                || columnsValidKeyArray[x] == "courses_avg" || columnsValidKeyArray[x] == "courses_instructor"
                                || columnsValidKeyArray[x] == "courses_title" || columnsValidKeyArray[x] == "courses_pass"
                                || columnsValidKeyArray[x] == "courses_fail" || columnsValidKeyArray[x] == "courses_audit"
                                || columnsValidKeyArray[x] == "courses_uuid"){
                                Where = keyArray[0] //dummy line of code so further check would be done outside of for-loop
                            } else return false
                        }
                        orderValidKey = optionsValue[columnsEtcKey[1]];
                        if(orderValidKey == "courses_dept" || orderValidKey == "courses_id"
                            || orderValidKey == "courses_avg" || orderValidKey == "courses_instructor"
                            || orderValidKey == "courses_title" || orderValidKey == "courses_pass"
                            || orderValidKey == "courses_fail" || orderValidKey == "courses_audit"
                            || orderValidKey == "courses_uuid"){
                                Table = optionsValue[columnsEtcKey[2]];
                                if(Table == "TABLE"){
                                    checked = true;
                                    if(checked == true){
                                        return true
                                    }
                                }else return false;
                        }
                    } else return false;
                } else return false;


        }else return false;

    }

    hasFilter(filter:FilterQuery):boolean{ //
        var checked;
        var comparisonKey = Object.keys(filter); //gets first comparator from FILTER
        var comparisonValue = filter[comparisonKey[0]] //gets value from each FILTER
        var validProjectKey; //gets valid key e.g. courses_dept
        var mComparisonNumber; //gets value number from MComparison key/value pair
        var sComparisonString; //gets value string from SComparison key/value pair
        if(comparisonKey.length == 1){ //checks that there is only one comparator

            if(comparisonKey[0] == "AND" || comparisonKey[0] == "OR"){
                if(this.hasArrayFilter(comparisonValue) != false){
                    Log.test("true")
                } else return false;

            } else if(comparisonKey[0] == "LT" || comparisonKey[0] == "GT" || comparisonKey[0] == "EQ"){
                validProjectKey = Object.keys(comparisonValue);
                mComparisonNumber = comparisonValue[validProjectKey[0]];
                if(validProjectKey.length == 1 && (validProjectKey[0] == "courses_avg" || validProjectKey[0] == "courses_pass" ||
                    validProjectKey[0] == "courses_fail" || validProjectKey[0] == "courses_audit")){
                        if (isNumber(mComparisonNumber)){
                            return true;
                        }else Log.error("MComparator not a number")
                    return false;
                }else Log.error("Invalid Logical key")
                return false;

            } else if (comparisonKey[0] == "IS"){
                validProjectKey = Object.keys(comparisonValue);
                sComparisonString = comparisonValue[validProjectKey[0]];
                if(validProjectKey.length == 1  && (validProjectKey[0] == "courses_dept" || validProjectKey[0] == "courses_id"|| validProjectKey[0] == "courses_instructor"||validProjectKey[0] == "courses_title" || validProjectKey[0] == "courses_uuid")){
                    if(isString(sComparisonString)||(sComparisonString.toString().charAt(0) && sComparisonString.toString().charAt(sComparisonString.toString().length - 1) &&
                        isString(sComparisonString))){
                        return true;
                    }else return false;
                }return false;

            } else if (comparisonKey[0] == "NOT"){
                if(this.hasFilter(comparisonValue) != false){
                    Log.test("NEGATION is good")
                } else return false
            } else return false
        }else return false
    }

    hasArrayFilter(filterArray:FilterQuery[]):boolean{

            for(let x in filterArray){
                if(this.hasFilter(filterArray[x]) == false) {//checks if each element is actually FILTER
                    return false
                }
            }


    }

}
