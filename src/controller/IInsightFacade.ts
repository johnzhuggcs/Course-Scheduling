/*
 * This is the primary high-level API for the project. In this folder there should be:
 * A class called InsightFacade, this should be in a file called InsightFacade.ts.
 * You should not change this interface at all or the test suite will not work.
 */

export interface InsightResponse {
    code: number;
    body: {}; // the actual response
}

export interface QueryRequest {
    // you can define your own structure that complies with the EBNF here

    WHERE:FilterQuery;
    OPTIONS:ColumnsQuery;
    TRANSFORMATIONS?:TransformationQuery
    [propName: string]: any;
}

export interface TransformationQuery{
    GROUP:[string];
    APPLY:[{string:Token}]
}


export interface Token{
    MAX?:string;
    MIN?:string;
    AVG?:string;
    COUNT?:string;
    SUM?:string;
    [propName:string]:any
}



export interface FilterQuery{
    OR?:[FilterQuery];
    AND?:[FilterQuery];
    LT?:MCompare;
    GT?:MCompare;
    EQ?:MCompare;
    IS?:SCompare;
    NOT?:FilterQuery;
    [propName:string]:any;
}

export interface MCompare{
    //Valid Keys with number values
    courses_avg?: number;        //The average of the course offering.
    courses_pass?: number;       //The number of students that passed the course offering.
    courses_fail?: number;       //The number of students that failed the course offering.
    courses_audit?: number;      //The number of students that audited the course offering.
    courses_year?: number;       //The year in which the section is offered
    rooms_lat?: number;
    rooms_lon?: number;
    rooms_seats?: number;

}

export interface SCompare{
    //Valid Keys with string values
    courses_dept?: string;       //The department that offered the course.
    courses_id?: string;         //The course number (will be treated as a string (e.g., 499b)).
    courses_instructor?: string; //The instructor teaching the course offering.
    courses_title?: string;      //The name of the course.
    courses_uuid?:string;        //The unique id of a course offering.
    rooms_fullname?:string;
    rooms_shorname?:string;
    rooms_name?:string;
    rooms_type?:string;
    courses_year?:number;
}

export interface ColumnsQuery{
    COLUMNS:[string];
    ORDER?:{dir:Direction, keys?:[string]}|string;
    FORM:"TABLE"
}

export interface Direction{
    UP?:string
    DOWN?:string
}

export interface IInsightFacade {

    /**
     * Add a dataset to UBCInsight.
     *
     * @param id  The id of the dataset being added.
     * @param content  The base64 content of the dataset. This content should be in the
     * form of a serialized zip file.
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * After receiving the dataset, it should be processed into a data structure of
     * your design. The processed data structure should be persisted to disk; your
     * system should be able to load this persisted value into memory for answering
     * queries.
     *
     * Ultimately, a dataset must be added or loaded from disk before queries can
     * be successfully answered.
     *
     * Response codes:
     *
     * 201: the operation was successful and the id already existed (was added in
     * this session or was previously cached).
     * 204: the operation was successful and the id was new (not added in this
     * session or was previously cached).
     * 400: the operation failed. The body should contain {"error": "my text"}
     * to explain what went wrong.
     *
     */
    addDataset(id: string, content: string): Promise<InsightResponse>;

    /**
     * Remove a dataset from UBCInsight.
     *
     * @param id  The id of the dataset to remove.
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.

     * This will delete both disk and memory caches for the dataset for the id meaning
     * that subsequent queries for that id should fail unless a new addDataset happens first.
     *
     * Response codes:
     *
     * 204: the operation was successful.
     * 404: the operation was unsuccessful because the delete was for a resource that
     * was not previously added.
     *
     */

    setZoomToTagName(dataToZoom: any, destination: string): any;

    setZoomToClassOrId(dataToZoom: any, destination: string): any;

    scanRowForInfoWithoutChildNodes(row: any, valueToGet: string): any;

    getInnerAttrInsteadOfChildNode(row: any, valueToGet: string): any;

    validStringListOfBuildings(isthis: any, shortNameList: string[], fullNameList: string[], addressList: string[], hrefList: string[], indexString: string): any;

    getLatLon(rooms_address: string, invalidRoomCounter: number): Promise<any>;

    pushParsedJPromisesToArray(isthis: any, arrayOfPromises: any, arrayOfAddr: string[], invalidRoomCounter: number): any;

    removeDataset(id: string): Promise<InsightResponse>;


    /**
     * Perform a query on UBCInsight.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     *
     * @return Promise <InsightResponse>
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * Return codes:
     *
     * 200: the query was successfully answered. The result should be sent in JSON according in the response body.
     * 400: the query failed; body should contain {"error": "my text"} providing extra detail.
     * 424: the query failed because it depends on a resource that has not been PUT. The body should contain {"missing": ["id1", "id2"...]}.
     *
     */

    performQuery(query: QueryRequest): Promise<InsightResponse>;

    /** Checks if query provided is valid
     *
     * @param query
     */

    isValid(query: QueryRequest): any;

    /** Checks if query provided has filter
     * needed as LOGICCOMPARISON and NEGATION recursively contains FILTER
     * @param filter
     */
    hasFilter(filter: FilterQuery, invalidIdArray: string[], isOneDataset: any): any;

    /** Used if encounters array of filter, iterates and calls hasFilter() for each element
     *
     * @param filterArray, invalidIdArray
     */
    hasArrayFilter(filterArray: FilterQuery[], invalidIdArray: string[], isOneDataset: any): boolean|string[];

    /** Used for iterating through logic comparisons
     *
     * @param logicFilter
     */

    getFilterArray(logicFilter: any): any;

    /** Translates valid keys into database
     *
     * @param validKey
     */
    //vocabValidKey(validKey:string):string|boolean;

    /** Translates database keys into validkey
     *
     * @param validKey
     */
    vocabDataBase(databaseKey: string): string|boolean;

    /** General filter function that filters out unneeded fields in atomicReturnInfo
     *
     * @param returnInfo
     * @param resultOfWherd, which is basically the "Filter"
     * @param keys, which is the key in the filter, so {"LT":{"courses_avg":97)}
     */

    filterQueryRequest(returnInfo: any, resultOfWhere: any, keys: any): any;

    /** is lessthan, returns a new returnInfo
     *
     * @param returnInfo
     * @param resultKeyArray
     * @param keys
     * @param sortVal
     */

    isLessThan(returnInfo: any, resultKeyArray: any, keys: string[], sortVal: any): any;

    /** is greaterthan, returns a new returnInfo
     *
     * @param returnInfo
     * @param resultKeyArray
     * @param keys
     * @param sortVal
     */

    isGreaterThan(returnInfo: any, resultKeyArray: any, keys: string[], sortVal: any): any;

    /** is equalTo, returns a new returnInfo
     *
     * @param returnInfo
     * @param resultKeyArray
     * @param keys
     * @param sortVal
     */

    isEqualTo(returnInfo: any, resultKeyArray: any, keys: string[], sortVal: any): any;

    /** is IS, returns a new returnInfo, handles wildcard search strings
     *
     * @param returnInfo
     * @param resultKeyArray
     * @param keys
     * @param sortVal
     */

    isIsLOL(returnInfo: any, resultKeyArray: any, keys: string[], sortVal: string): any;

    /** is NOT, removes atomicInfos in returnInfo from the subsequent filters returned with tempReturnInfos
     *
     * @param returnInfo
     * @param tempReturnInfo

     */

    isNOT(returnInfo: any, tempReturnInfo: any, sortKey: any, resultKeyArray: any): any;

    /** gets the id of dataset from valid keys
     *
     * @param result
     * @param keys
     */

    /** merges and removes duplicates in each array
     *
     * @param theWaitingArray
     * @param theIteratedArray
     */

    mergeDeDuplicate(theWaitingKeyValue: any, theIteratedKeyValue: any): any;

    /** Function that count occurrences of a substring in a string;
     * @param {String} string               The string
     * @param {String} subString            The sub string to search for
     * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
     *
     * @author Vitim.us https://gist.github.com/victornpb/7736865
     * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
     * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
     */

    occurrences(string: string, subString: string, allowOverlapping: boolean): any;

    /** Does Transformations
     * @param finalReturnInfo
     * @param transformationGroup
     * @param transformationApply
     * @param transformationExists:any
     */

    transformationQueryHelper(finalReturnInfo: any, transformationGroup: any, transformationApply:any, applyExists:any, groupedApplyArray:any): any;


    /** Does Transformations
     * @param returnInfo
     * @param groupReturnInfos
     * @param transformationApply
     */

    groupQueryHelper(returnInfo: any, groupReturnInfo:any, transformationApply:any): any;

    /** Breaks ties when sorting
     * @param a
     * @param b
     * @param sortArray
     */
    breakingTies(a: any, b: any, sortArray: any, direction:string): any


    /** checks applykey has string from column
     * @param apply
     * @param columnsKey
     */
    applyHasColumn(Apply:any, columnsKey:any):any

    /** gets objects from Apply to be added to each returnInfo
     * @param tranformationApply
     * @param returninfo
     */
    applyObjects(tranformationApply:any, returnInfo:any):any

    /** calculates min
     * @param groupedValue
     * @param testValue
     */

    returnMin(groupedValue:any, testValue:any):any

    /** calculates max
     * @param groupedValue
     * @param testValue
     */
    returnMax(groupedValu:any, testValue:any):any

    /** calculates SUM
     * @param groupedValue
     * @param applyKey
     * @param testValue
     */
    returnSum(groupedValue:any, testValue:any):any

    /** calculates AVG
     * @param groupedInfo
     * @param testValue
     */
    returnAVG(groupedInfo:any, applyKey:any, testValue:any):any

    /** calculates COUNT
     * @param groupedValue
     * @param testValue
     */
    returnCOUNT(groupedValue:any, testValue:any):any

    /** finishes AVG
     * @param returnInfo
     */

    finishApply(returnInfo:any):any

    /**
     * calculates distances from two sets of latlon
     * @param lat1
     * @param lat2
     * @param lat3
     * @param lat4 DATA CLUMP
     */

    getDistanceFromLatLonInKm(lat1:number, lon1:number, lat2:number, lon2:number):number;

    /**
     * converts degrees to radians
     * @param degrees
     */

    deg2rad(deg:number):number

    /**
     * new order function essentially
     * @param dir
     * @param keysArray
     * @param finalReturn
     */
    newD3Order(dir:string, keysArray:any[], finalReturn:any):any

    /**
     * sorting within order itself
     * @param dir
     * @param keysArray
     * @param a
     * @param b
     */
    innerOrderTwoElements(dir:string, keysArray:any[], a:any, b:any):any

    /**
     * checks within order to see if it contains valid keys
     * @param orderKey
     * @param yesOrNo
     * @param dataSet
     * @param invalidIdArray
     */

    queryCheckingOrder(orderKey:any, yesOrNo:string, dataSet:any, invalidIdArray:any, applyExists:any):any

}
