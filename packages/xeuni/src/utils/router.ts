// 路由辅助类
export class Router {
  static push(
    url: string,
    {
      query,
      replace = false
    }: { query?: { [q: string]: unknown }; replace?: boolean } = {}
  ) {
    const fquery = [];
    // query 参数处理
    if (query) {
      if (query.constructor !== Object) {
        return console.error("query must be an object");
      }

      for (let [key, value] of Object.entries(query)) {
        if (value && value.constructor !== String) {
          value = JSON.stringify(value);
        }
        fquery.push(key + "=" + value);
      }
    }

    const joint = /\?/.test(url) ? "&" : "?";
    const func = replace ? uni.redirectTo : uni.navigateTo;
    const furl = url + joint + fquery.join("&");

    func({ url: furl });
  }
}
