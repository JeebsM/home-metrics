import { Record } from "../models/Record";

/**
 * @public
 */
export enum ResultStatus {
  succes = "success",
  warning = "warning",
  error = "error",
}

/**
 * @public
 */
export interface ResultInterface {
  resultStatus: ResultStatus;
  message: string;
  record?: Record;
}

/**
 * @public
 */
export class Result implements ResultInterface {
  resultStatus: ResultStatus = ResultStatus.error;
  message: string = "";
  record?: Record;

  constructor(resultStatus: ResultStatus, message: string, record?: Record) {
    this.resultStatus = resultStatus;
    this.message = message;
    this.record = record;
  }

  isSucces(): boolean {
    return this.resultStatus == ResultStatus.succes;
  }
}

/**
 * @protected
 */
interface Collection<Record> {
  [Key: string]: Record;
}

/**
 * @protected
 * @type {Result}
 */
const defaultResult: Result = new Result(
  ResultStatus.error,
  "Something went wrong"
);

/**
 * @protected
 * @type {Result}
 */
const defaultSuccessResult: Result = new Result(ResultStatus.succes, "Success");

/**
 * @private
 * @return {Collection<Record> }
 */
function getRecordsFromStorage(): Collection<Record> {
  let records_str: string = localStorage.getItem("records") || "{}";
  let records: Collection<Record> = JSON.parse(records_str);
  return records;
}

/**
 * @private
 * @param {record<Record>}
 * @return {result<Result>}
 */
function saveRecords(record: Record): Result {
  if (!localStorage.getItem("records")) {
    localStorage.setItem("records", JSON.stringify({}));
  }

  let records = getRecordsFromStorage();
  let new_records: Collection<Record>;

  new_records = { ...records, [record.id]: record };

  localStorage.setItem("records", JSON.stringify(new_records));

  return new Result(ResultStatus.succes, "Records saved.");
}

/**
 * @public
 * @return {result<Result>}
 */
export function saveRecord(record: Record): Result {
  let result = defaultResult;
  try {
    // localStorage.setItem(record.id, JSON.stringify(record));
    result = saveRecords(record);

    if (result.resultStatus != ResultStatus.succes) {
      throw new Error(result.message);
    }

    result = new Result(
      ResultStatus.succes,
      "Record saved in local storage with key " + record.id
    );
  } catch (e) {
    result = new Result(ResultStatus.error, (e as Error).message);
  }
  return result;
}

/**
 * @public
 * @return {result<Result>}
 */
export function getRecord(id: string): Result {
  let records = getRecordsFromStorage();

  if (id in records) {
    let record: Record = records[id];
    return new Result(
      defaultSuccessResult.resultStatus,
      defaultSuccessResult.message,
      record
    );
  } else {
    return new Result(
      defaultResult.resultStatus,
      `Record with id ${id} not found.`
    );
  }
}

/**
 * @public
 * @return {result<Result>}
 */
export function getLastRecord(): Result {
  let records = getRecordsFromStorage();

  if (Object.keys(records).length == 0) {
    return new Result(defaultResult.resultStatus, `Last record not found.`);
  }

  let lastRecordId = Object.entries(records).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
  let result = getRecord(lastRecordId);

  if (result.resultStatus == ResultStatus.succes && result.record) {
    return new Result(
      defaultSuccessResult.resultStatus,
      defaultSuccessResult.message,
      result.record
    );
  } else {
    return new Result(defaultResult.resultStatus, `Last record not found.`);
  }
}
