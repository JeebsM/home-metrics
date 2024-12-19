import { DATA_VALIDITY, LAST_REFRESH_TIMESTAMP, REFRESH_TIMESTAMPS, SESSION_VALIDITY, URI } from "../constants";
import Webservice from "./Webservice";

  class Datastore {
    webservice: Webservice;
    refreshTimestamps: { [key: string]: number };

    constructor() {
      this.webservice = new Webservice();
      this.refreshTimestamps = {};
      const lastRefreshTimestamp = this.__getLastRefreshTimestamp();
      const currentTs = new Date().getTime();
      const dataEndOfLife = lastRefreshTimestamp + DATA_VALIDITY;
      const sessionEndOfLife = lastRefreshTimestamp + SESSION_VALIDITY;
      const dataIsTooOld: boolean = dataEndOfLife < currentTs;
      const sessionIsTooOld: boolean = sessionEndOfLife < currentTs;
      if (dataIsTooOld) this.__cleanStorage(false);
      if (sessionIsTooOld) this.__cleanStorage(true);
    }

    __cleanStorage(fullClean: boolean = false) {
      if (fullClean) localStorage.clear();
      const refreshTimestamps = this.__fetchFromStorage(REFRESH_TIMESTAMPS);
      Object.entries(refreshTimestamps).map((item) => {
        const itemName = item[0];
        localStorage.removeItem(itemName);
      });
      localStorage.removeItem(REFRESH_TIMESTAMPS);
    }

    refresh<T>(keyName: string): Promise<T> {
      let dataPromise: Promise<any> = new Promise(() => {
        return [{}];
      });
      if (keyName == 'records') {
        dataPromise = this.__refreshRecords();
        return dataPromise;
      }
      return dataPromise;
    }

    async get(keyName: string): Promise<any> {
      let currentTs = new Date().getTime();
      let lastRefresh: number = this.__getRefreshTimestamp(keyName);
      let existInStorage: boolean = localStorage.getItem(keyName) != null;
      let dataIsStillValid: boolean = lastRefresh + DATA_VALIDITY > currentTs;
      if (existInStorage && dataIsStillValid) {
        return this.__fetchFromStorage(keyName);
      }

      let dataPromise = this.refresh(keyName);
      try {
        const value = await dataPromise.then((res) => {
          this.__saveInStorage(keyName, res);
          this.__refreshTimestamps(keyName);
          localStorage.setItem(LAST_REFRESH_TIMESTAMP, currentTs.toString());
          return res;
        });
        return value;
      } catch (error) {
        throw error;
      }
      }

      __refreshRecords(): Promise<any> {
    const uri = URI.RECORDS;
    const dataPromise = this.webservice.get(uri);
    return dataPromise;
    }

    __getRefreshTimestamp(keyName: string): number {
      let timestamps = this.__fetchFromStorage(REFRESH_TIMESTAMPS);
      if (timestamps.hasOwnProperty(keyName)) {
        return parseInt(timestamps[keyName]);
      }
      return 0;
    }

    __getLastRefreshTimestamp(): number {
      let timestamp: string = localStorage.getItem(LAST_REFRESH_TIMESTAMP) || '0';
      return parseInt(timestamp);
    }

    __refreshTimestamps(keyName: string) {
      let currentTimestamp = new Date().getTime();
      let timestamps = this.__fetchFromStorage(REFRESH_TIMESTAMPS);
      timestamps[keyName] = currentTimestamp.toString();
      this.__saveInStorage(REFRESH_TIMESTAMPS, timestamps);
    }

    __saveInStorage(keyName: string, content: any) {
      try {
        let contentString: string = JSON.stringify(content);
        localStorage.setItem(keyName, contentString);
      } catch (error) {
        throw error;
      }
    }

    __fetchFromStorage(keyName: string) {
      try {
        let contentString: string = localStorage.getItem(keyName) || '{}';
        let content = JSON.parse(contentString);
        return content;
      } catch (error) {
        throw error;
      }
    }
  }

  export default Datastore;
