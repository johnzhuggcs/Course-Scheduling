/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest, FilterQuery, TypeScriptSucks} from "./IInsightFacade";

import Log from "../Util";
import {isString} from "util";
import {isNumber} from "util";
import {createGunzip} from "zlib";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    base64ToBuffer(str:string):any {
        Log.info("this function runs!");
        str = window.atob(str); // creates a ASCII string
        Log.info("this function runs: " + str);
        var buffer = new ArrayBuffer(str.length),
            view = new Uint8Array(buffer);
        for(var i = 0; i < str.length; i++){
            view[i] = str.charCodeAt(i);
        }
        return buffer;
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        return new Promise(function (fulfill, reject) {

            var request = require('request');
            var JSZip = require('jszip');
            var fs = require('fs');
            var zip = new JSZip();
            var arrayOfId: string[] = [];
            var arrayOfUnparsedFileData: any = [];

            var filesNotJsonCounter = 0;
            var noOfFiles = 0;
            var noOfJsonStored = 0;

            zip.loadAsync(content, {'base64': true}).then(function (zipasync: any) { //converts the content string to a JSZip object and loadasync makes everything become a promise


                zipasync.forEach(function (relativePath: any, file: any) {
                        if (file.name != 'multi_courses/') {
                            var filecompressednoasync = file._data.compressedContent;
                            arrayOfUnparsedFileData.push(file.async("string"));
                        }
                    }
                );
                Promise.all(arrayOfUnparsedFileData).then(arrayofUnparsedFileDataAll => {
                    var arrayCounter = 0;
                    var parsedJSON = '';
                    var data = '';
                    for (let i in arrayofUnparsedFileDataAll) {
                        try {
                            JSON.parse(JSON.stringify(arrayofUnparsedFileDataAll[i]));//JSON.parse
                        }
                        catch (err) {
                            err;
                            filesNotJsonCounter++;
                        }
                        noOfFiles++;
                        noOfJsonStored++;
                        parsedJSON += String(arrayofUnparsedFileDataAll[i]) + "\r\n";//JSON.parse
                    }

                    if (filesNotJsonCounter == noOfFiles) {
                        var ir2: InsightResponse = {code: 400, body: {'error': 'Could not parse JSON'}};
                        reject(ir2);
                    }

                    if (noOfJsonStored == arrayofUnparsedFileDataAll.length) {
                        if (!fs.existsSync('existingIds_Don\'tMakeAnotherIdOfThisFileName')) {
                            fs.writeFile(id, parsedJSON, (err: Error) => {
                                if (err) throw err;
                            });//write data file
                            fs.writeFile('existingIds_Don\'tMakeAnotherIdOfThisFileName', id + "\r\n", (err: Error) => {
                                if (err) throw err;
                            }); //for new storage
                            var ir4: InsightResponse = {code: 204, body: {}};
                            fulfill(ir4);
                        }
                        else if (fs.existsSync('existingIds_Don\'tMakeAnotherIdOfThisFileName')) {
                            data = fs.readFileSync('existingIds_Don\'tMakeAnotherIdOfThisFileName').toString('utf8');
                            arrayOfId = data.split("\r\n");
                            if (!arrayOfId.includes(id)) {
                                {
                                    fs.writeFile(id, parsedJSON, (err: Error) => {
                                        if (err) throw err;
                                    });
                                    fs.writeFile('existingIds_Don\'tMakeAnotherIdOfThisFileName', id + "\r\n", (err: Error) => {
                                        if (err) throw err;
                                    });
                                    var ir4: InsightResponse = {code: 204, body: {}};
                                    fulfill(ir4);
                                }
                            }
                            else {
                                var count = -1;
                                for (let i in arrayOfId) {
                                    if (arrayOfId[i] != fs.existsSync(id)) {
                                        count++;
                                    }
                                }
                                id = id + "(" + count + ")";

                                fs.writeFile(id, parsedJSON, (err: Error) => {
                                    if (err) throw err;
                                });//datafile is written
                                data += id + "\r\n";
                                fs.writeFile('existingIds_Don\'tMakeAnotherIdOfThisFileName', data, (err: Error) => {
                                    if (err) throw err;
                                });
                                arrayOfId = [];
                                if (noOfJsonStored == arrayofUnparsedFileDataAll.length) {
                                    var ir4: InsightResponse = {code: 201, body: {}};
                                    fulfill(ir4);
                                }
                            }
                        }
                    }
                });
            }).catch(function (e: any) {
                var ir2: InsightResponse = {code: 400, body: {e}};
                reject(ir2);
            });
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        //by providing the id, remove the dataset


        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        //perform query

        if(this.isValid(query) == true){
            return null;


        }else
        return null;
        //perform query

    }

    isValid(query:QueryRequest):boolean{
        //checks for query provided is of valid syntax
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
                    optionsValue = query[Options]; //gets all values from OPTIONS
                    columnsEtcKey = Object.keys(optionsValue); //gets all the "key" within the value from OPTIONS, such as COLUMNS and etc...
                    if(columnsEtcKey.length == 3 && columnsEtcKey[0] == "COLUMNS" && columnsEtcKey[1] == "ORDER" && columnsEtcKey[2] == "FORM"){
                        columnsValidKeyArray = optionsValue[columnsEtcKey[0]] //returns an a possible array of valid keys in COLUMNS
                        for(let x in columnsValidKeyArray){
                            if(columnsValidKeyArray[x] == "courses_dept" || columnsValidKeyArray[x] == "courses_id"
                                || columnsValidKeyArray[x] == "courses_avg" || columnsValidKeyArray[x] == "courses_instructor"
                                || columnsValidKeyArray[x] == "courses_title" || columnsValidKeyArray[x] == "courses_pass"
                                || columnsValidKeyArray[x] == "courses_fail" || columnsValidKeyArray[x] == "courses_audit"
                                || columnsValidKeyArray[x] == "courses_uuid"){ //checks for valid keys
                                Where = keyArray[0] //dummy line of code so further check would be done outside of for-loop
                            } else return false
                        }
                        orderValidKey = optionsValue[columnsEtcKey[1]]; //gets ORDER key
                        if(orderValidKey == "courses_dept" || orderValidKey == "courses_id"
                            || orderValidKey == "courses_avg" || orderValidKey == "courses_instructor"
                            || orderValidKey == "courses_title" || orderValidKey == "courses_pass"
                            || orderValidKey == "courses_fail" || orderValidKey == "courses_audit"
                            || orderValidKey == "courses_uuid"){ //checks for valid key
                                Table = optionsValue[columnsEtcKey[2]];
                                if(Table == "TABLE"){ //if value of FORM is TABLE
                                        return true
                                }else return false;
                        }
                    } else return false;
                } else return false;


        }else return false;
    }

    hasFilter(filter:FilterQuery):boolean{ //
        var comparisonKey = Object.keys(filter); //gets first comparator from FILTER
        var comparisonValue = filter[comparisonKey[0]] //gets value from each FILTER
        var validProjectKey; //gets valid key e.g. courses_dept
        var mComparisonNumber; //gets value number from MComparison key/value pair
        var sComparisonString; //gets value string from SComparison key/value pair
        if(comparisonKey.length == 1){ //checks that there is only one comparator

            if(comparisonKey[0] == "AND" || comparisonKey[0] == "OR"){
                if(this.hasArrayFilter(comparisonValue) != false){ //anything that isn't a false (meaning error) passes)
                    Log.test("true")
                } else return false;

            } else if(comparisonKey[0] == "LT" || comparisonKey[0] == "GT" || comparisonKey[0] == "EQ"){ //checks for MCOMPARATOR
                validProjectKey = Object.keys(comparisonValue);
                mComparisonNumber = comparisonValue[validProjectKey[0]];
                if(validProjectKey.length == 1 && (validProjectKey[0] == "courses_avg" || validProjectKey[0] == "courses_pass" ||
                    validProjectKey[0] == "courses_fail" || validProjectKey[0] == "courses_audit")){ //make sure only a valid key exists
                        if (isNumber(mComparisonNumber)){ //makes sure the valid keys are mapped to a number
                            return true;
                        }else
                    return false;
                }else
                return false;

            } else if (comparisonKey[0] == "IS"){ //SComparator
                validProjectKey = Object.keys(comparisonValue);
                sComparisonString = comparisonValue[validProjectKey[0]];
                if(validProjectKey.length == 1  && (validProjectKey[0] == "courses_dept" || validProjectKey[0] == "courses_id"|| validProjectKey[0] == "courses_instructor"||validProjectKey[0] == "courses_title" || validProjectKey[0] == "courses_uuid")){
                    if(isString(sComparisonString)||(sComparisonString.toString().charAt(0) && sComparisonString.toString().charAt(sComparisonString.toString().length - 1) &&
                        isString(sComparisonString))){
                        return true;
                    }else return false;
                }else return false;

            } else if (comparisonKey[0] == "NOT"){ //NEGATION
                if(this.hasFilter(comparisonValue) != false){ //loops back to FILTER
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
