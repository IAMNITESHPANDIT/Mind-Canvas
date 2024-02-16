export const dataHandler = (data) => {
    return data.length > 0
      ? data.map((item) => ({
          ...item,
          hashtags: item.hashtag.length > 0 ? stringToArray(item.hashtag) : [],
        }))
      : [];
  };
  

export   function arrayToString(arr) {
    return arr?.length > 0 ? arr.join(" ") : "";
  }
  
 export function stringToArray(str) {
    return str.split(" ");
  }