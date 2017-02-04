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

            zip.loadAsync(content, {'base64': true}).then(function (zipasync: any) { //converts the content string to a JSZip object and loadasync makes everything become a promise


                zipasync.forEach(function (relativePath: any, file: any) {
                        if (!(/(.*)\/$/.test(file.name))) { //multi_courses/ VS multi_courses.zip  /(.\*)\//
                            var filecompressednoasync = file._data.compressedContent;
                            arrayOfUnparsedFileData.push(file.async("string"));
                        }
                    }
                );
                Promise.all(arrayOfUnparsedFileData).then(arrayofUnparsedFileDataAll => {
                    var arrayCounter = 0;
                    var parsedJSON = '';
                    var data = '';
                    var isTry = true;
                    for (let i in arrayofUnparsedFileDataAll) {
                        try {
                            isTry = true;
                            var x = String(arrayofUnparsedFileDataAll[i]);//JSON.stringify doesn't work
                            JSON.parse(x);//JSON.parse
                        }
                        catch (err) {
                            filesNotJsonCounter++;
                            isTry = false;
                            err;
                        }
                        noOfFiles++;

                        if (isTry) {
                            parsedJSON += String(arrayofUnparsedFileDataAll[i]) + "\r\n";//JSON.parse
                        }
                    }


                    if (noOfFiles == 0) {
                        var ir2: InsightResponse = {code: 400, body: {'Error': 'No datafile is found'}};
                        reject(ir2);
                    }

                    if (filesNotJsonCounter == noOfFiles) {
                        var ir2: InsightResponse = {code: 400, body: {'Error': 'Could not parse JSON'}};
                        reject(ir2);
                    }

                    if (noOfFiles != 0 && filesNotJsonCounter != noOfFiles) {
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
                                var count = 0;
                                for (let i in arrayOfId) {
                                    if (arrayOfId.includes(id)||fs.existsSync(id)) {
                                        //if id exists in arrayOfId
                                        // or id exists in the project folder
                                        count++;
                                        id = id + "(" + count + ")";
                                        Log.info(id);
                                    }
                                }

                                fs.writeFile(id, parsedJSON, (err: Error) => {
                                    if (err) throw err;
                                });//datafile is written
                                data += id + "\r\n";
                                fs.writeFile('existingIds_Don\'tMakeAnotherIdOfThisFileName', data, (err: Error) => {
                                    if (err) throw err;
                                });
                                arrayOfId = [];
                                var ir4: InsightResponse = {code: 201, body: {}};
                                fulfill(ir4);
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
        //delete the zip file by id

        return new Promise(function (fulfill,reject) {
            var request = require('request');
            var JSZip = require('jszip');
            var fs = require('fs');
            var zip = new JSZip();

            if (fs.existsSync(id)) {
                zip.remove(id);


                var ir4: InsightResponse = {code: 204, body: {}};
                fulfill(ir4);



            } else {
                var ir4: InsightResponse = {code: 400, body: {}};
                reject(ir4);
            }

        });
    }


    //TODO: if (<key> not found in UBCInsight) {return promise 400 body: {invalid <key>}}
    /*TODO: return a promise --> search in UBCInsight (this is hell lot easier man...)
    //TODO: Store each Query of UBCInsight into an arrayOfQuery (.split(\r\n))
    //TODO: If (contains(keyword) -> extract the value of the key)

    //TODO: Check options for valid Id
    //TODO: Go into file and spli through \r\n

    // if (match with the content within the file-->
     */
    performQuery(query: QueryRequest): Promise <InsightResponse> {
        //perform query
        var fs = require("fs");
        var queryCheck = this.isValid(query);
        return new Promise(function (resolve, reject) {
            if(queryCheck == true){
                var filterVal = query.WHERE
                var keys = Object.keys(filterVal);
                var result = filterVal[keys[0]];
                var validKey;
                var contentDatasetResult;
                var cachedId = fs.readFileSync("existingIds_Don\'tMakeAnotherIdOfThisFileName").toString;
                var cachedIdArray = cachedId.split("\r\n");



                if(keys[0] == "AND" || keys[0] == "OR" || keys[0] == "NOT"){ //getting the corresponding id of dataset and reading it
                    var nonLogicFilter = this.getFilterArray(result);
                    var nonLogicFilterVals = nonLogicFilter[0];
                    var nonLogicFilterKeys = Object.keys(nonLogicFilterVals);
                    validKey = nonLogicFilterVals(nonLogicFilterKeys[0]);


                        for(let x in cachedIdArray){
                            if(validKey == cachedIdArray[x]){
                                contentDatasetResult = fs.readFileSync(validKey);
                            } else reject("error")
                        }


                    try {
                        contentDatasetResult = fs.readFileSync(validKey);
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            var code424InvalidQuery:InsightResponse = {code:424, body:{"missing":queryCheck}};
                            reject(code424InvalidQuery);

                        } else {
                            throw err;
                        }
                        // Here you get the error when the file was not found,
                        // but you also get any other error
                    }


                } else {
                    var nonLogicFilterVals = result[0];
                    var nonLogicFilterKeys = Object.keys(nonLogicFilterVals);
                    validKey = nonLogicFilterVals(nonLogicFilterKeys[0]);
                    contentDatasetResult = fs.readFileSync(validKey);
                }



            } else if(queryCheck instanceof Array){
                var code424InvalidQuery:InsightResponse = {code:424, body:{"error":queryCheck}};
                reject(code424InvalidQuery);

            }
                else{
                var code400InvalidQuery:InsightResponse = {code:400, body:{"error":"invalid query"}};
                reject(code400InvalidQuery);
            }
        });

        }

        //perform query



    getFilterArray(logicFilter:any):any{
        if(logicFilter instanceof Array) {

            var firstFilter = logicFilter[0];
            var keys = Object.keys(firstFilter);
            var innerResult = firstFilter[keys[0]];


            if(keys[0] == "AND" || keys[0] == "OR" || keys[0] == "NOT"){
                this.getFilterArray(innerResult);
            } else return innerResult;

        } else {
            var keys = Object.keys(logicFilter);
            var innerResult = logicFilter[keys[0]];
            if (keys[0] == "AND" || keys[0] == "OR" || keys[0] == "NOT") {
                this.getFilterArray(innerResult);
            } else return innerResult;
        }

    }

    isValid(query:QueryRequest):any{
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
        var invalidIdArray = new Array; //returns an array of id in query that do not exist
        var invalidIdLists;
        if(keyArray[0] == "WHERE" && keyArray[1] == "OPTIONS"){ //checks if outermost keys are WHERE and OPTIONS

                Where = keyArray[0]; //gets "WHERE"
                Options = keyArray[1]; //gets"OPTIONS"
                filter = query[Where]; //returns content of FILTER

                var temp = this.hasFilter(filter, invalidIdArray);
                if(temp != false && invalidIdArray.length == 0) { //check if FILTER is valid, needed as FILTER is recursively nested
                    optionsValue = query[Options]; //gets all values from OPTIONS
                    columnsEtcKey = Object.keys(optionsValue); //gets all the "key" within the value from OPTIONS, such as COLUMNS and etc...
                    if(columnsEtcKey.length == 3 && columnsEtcKey[0] == "COLUMNS" && columnsEtcKey[1] == "ORDER" && columnsEtcKey[2] == "FORM"){
                        columnsValidKeyArray = optionsValue[columnsEtcKey[0]] //returns an a possible array of valid keys in COLUMNS
                        for(let x in columnsValidKeyArray){
                            if(typeof columnsValidKeyArray[x] == "string" && (columnsValidKeyArray[x] == "courses_dept" || columnsValidKeyArray[x] == "courses_id"
                                || columnsValidKeyArray[x] == "courses_avg" || columnsValidKeyArray[x] == "courses_instructor"
                                || columnsValidKeyArray[x] == "courses_title" || columnsValidKeyArray[x] == "courses_pass"
                                || columnsValidKeyArray[x] == "courses_fail" || columnsValidKeyArray[x] == "courses_audit"
                                || columnsValidKeyArray[x] == "courses_uuid")){ //checks for valid keys
                                Where = keyArray[0] //dummy line of code so further check would be done outside of for-loop
                            } else if(typeof columnsValidKeyArray[x] == "string" && !(columnsValidKeyArray[x].startsWith("courses")) &&
                                (columnsValidKeyArray[x].endsWith("_dept") || columnsValidKeyArray[x].endsWith("_id") || columnsValidKeyArray[x].endsWith("_avg") ||
                                columnsValidKeyArray[x].endsWith("_instructor") || columnsValidKeyArray[x].endsWith("_title") || columnsValidKeyArray[x].endsWith("_pass") ||
                                columnsValidKeyArray[x].endsWith("_fail") || columnsValidKeyArray[x].endsWith("_audit") || columnsValidKeyArray[x].endsWith("_uuid"))){

                                invalidIdLists = columnsValidKeyArray.split("_");

                                if(invalidIdArray.includes(invalidIdLists[0])){
                                    invalidIdLists = [];
                                } else {
                                    invalidIdArray.push(invalidIdLists[0]);
                                }

                            }else
                                return false
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
                        } else if(typeof orderValidKey == "string" && !(orderValidKey.startsWith("courses")) &&
                            (orderValidKey.endsWith("_dept") || orderValidKey.endsWith("_id") || orderValidKey.endsWith("_avg") ||
                            orderValidKey.endsWith("_instructor") || orderValidKey.endsWith("_title") || orderValidKey.endsWith("_pass") ||
                            orderValidKey.endsWith("_fail") || orderValidKey.endsWith("_audit") || orderValidKey.endsWith("_uuid"))){

                            invalidIdLists = columnsValidKeyArray.split("_");
                            if(invalidIdArray.includes(invalidIdLists[0])){
                                invalidIdLists = [];
                            } else {
                                invalidIdArray.push(invalidIdLists[0]);
                            }
                            return invalidIdArray;
                        }else return false
                    } else return false;
                } else if(invalidIdArray.length > 0){
                    Log.error(typeof invalidIdArray)
                    return invalidIdArray
                }else return false;


        }else return false;
    }

    hasFilter(filter:FilterQuery, invalidIdArray:any):boolean{ //
        var comparisonKey = Object.keys(filter); //gets first comparator from FILTER
        var comparisonValue = filter[comparisonKey[0]] //gets value from each FILTER
        var validProjectKey; //gets valid key e.g. courses_dept
        var mComparisonNumber; //gets value number from MComparison key/value pair
        var sComparisonString; //gets value string from SComparison key/value pair
        if(comparisonKey.length == 1){ //checks that there is only one comparator

            if(comparisonKey[0] == "AND" || comparisonKey[0] == "OR"){
                if(this.hasArrayFilter(comparisonValue, invalidIdArray) != false){ //anything that isn't a false (meaning error) passes)
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
                }else if(typeof  validProjectKey[0] == "string" && !(validProjectKey[0].startsWith("courses")) &&
                    (validProjectKey[0].endsWith("_avg") || validProjectKey[0].endsWith("_pass") ||
                    validProjectKey[0].endsWith("_fail") || validProjectKey[0].endsWith("_audit"))){

                    var invalidIdLists = validProjectKey[0].split("_");

                    if(invalidIdArray.includes(invalidIdLists[0])){
                        invalidIdLists = [];
                    } else {
                        invalidIdArray.push(invalidIdLists[0]);
                    }
                    return invalidIdArray;
                }else return false;


            } else if (comparisonKey[0] == "IS"){ //SComparator
                validProjectKey = Object.keys(comparisonValue);
                sComparisonString = comparisonValue[validProjectKey[0]];
                if(validProjectKey.length == 1  && (validProjectKey[0] == "courses_dept" || validProjectKey[0] == "courses_id"|| validProjectKey[0] == "courses_instructor"||validProjectKey[0] == "courses_title" || validProjectKey[0] == "courses_uuid")){
                    if(isString(sComparisonString)||(sComparisonString.toString().charAt(0) && sComparisonString.toString().charAt(sComparisonString.toString().length - 1) &&
                        isString(sComparisonString))){
                        return true;
                    }else return false;
                } else if(typeof validProjectKey[0] == "string" && !(validProjectKey[0].startsWith("courses")) &&
                    (validProjectKey[0].endsWith("_dept") || validProjectKey[0].endsWith("_id") ||
                    validProjectKey[0].endsWith("_instructor") || validProjectKey[0].endsWith("_title")|| validProjectKey[0].endsWith("_uuid"))){

                    var invalidIdLists = validProjectKey[0].split("_");

                    if(invalidIdArray.includes(invalidIdLists[0])){
                        invalidIdLists = [];
                    } else {
                        invalidIdArray.push(invalidIdLists[0]);
                    }
                    return invalidIdArray;
                }else return false;

            } else if (comparisonKey[0] == "NOT"){ //NEGATION
                if(this.hasFilter(comparisonValue, invalidIdArray) != false){ //loops back to FILTER
                    Log.test("NEGATION is good")
                } else return false
            } else return false
        }else return false
    }

    hasArrayFilter(filterArray:FilterQuery[], invalidIdArray:string[]):boolean|string[]{

            for(let x in filterArray){
                if(this.hasFilter(filterArray[x], invalidIdArray) == false) {//checks if each element is actually FILTER
                    return false
                }
            }


    }

}
