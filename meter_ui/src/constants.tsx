export const DATA_VALIDITY = 60 * 60 * 1000; // 1 hour
export const SESSION_VALIDITY = 8 * 60 * 60 * 1000; // 8 hours
export const REFRESH_TIMESTAMPS = "refreshTimestamps";
export const LAST_REFRESH_TIMESTAMP = "lastRefreshTimestamp";

export const LANGUAGES = [
  { label: "Français", code: "fr" },
  { label: "English", code: "en" },
  { label: "Nederlands", code: "nl" },
];

export const COLORS = {
  WHITE: "white",
  BLUE: "#096077",
  GREEN: "#75B626",
  RED: "red",
  GRAY: "gray",
  BLACK: "black",
};

// const apiUriKey: string = import.meta.env.VITE_API_URI;
// const apiUri: string = apiUriKey.split(' ')[0].replace(/'/g, '');

export const URI = {
  RECORDS: "/meter/all",
  CREATE_RECORD: "/meter/",
  UPDATE_RECORD: "/meter/",
};
