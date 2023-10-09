/**
 * HTML5Plus相关API
 */

export type AppTarget = "weixin" | "qq" | "sinaweibo" | "google" | "facebook";

export type AppShare = PlusShareShareService & {
  launchMiniProgram(
    options: PlusShareWeixinMiniProgramOptions,
    succeed: (res: any) => void,
    err: (res: any) => void
  ): void;
};

export function errorHandler(
  code: number | string, msg?: string,
  ignore: boolean = false
) {
  if (ignore) {
    return;
  }
  if (code === -8) {
    msg = "xzTips：非真机环境下，不存在微信客户端软件";
  }

  console["error"](`xzTips：${msg}`);
  uni.showToast({
    title: msg,
    icon: "none"
  });
}

export async function getAppServices<T>(cate: keyof Plus, target: AppTarget) {
  const services =
    (await new Promise<(T & { id: string })[]>((resolve) => {
      const api = plus[cate];

      if ("getServices" in api) {
        api.getServices((services) => {
          resolve(services as unknown as (T & { id: string })[]);
        });
      }
    })) ?? [];
  return services?.find((item) => item.id === target);
}

export function getAppOauth(target: AppTarget) {
  return getAppServices<PlusOauthAuthService>("oauth", target);
}

export function getAppShare(target: AppTarget) {
  return getAppServices<AppShare>("share", target);
}

export class IO {
  static async resolveLocalFileSystemURL(path: string) {
    return await (new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(
        path,
        (entry) => resolve(entry),
        (err) => {
          errorHandler(err);
          reject(err);
        }
      );
    }));
  }

  static async getFile(path: string): Promise<PlusIoFile | undefined> {
    const entry = await this.resolveLocalFileSystemURL(path);

    if (!entry) {
      return;
    }
    return await (new Promise((resolve, reject) => {
      (entry as PlusIoFileEntry).file(
        (result) => resolve(result),
        (result) => {
          errorHandler(result);
          reject(result);
        }
      );
    }));
  }

  static reader = class {
    private readonly file: PlusIoFile;
    private fileReader = new plus.io.FileReader!();

    constructor(file: PlusIoFile) {
      this.file = file;
    }

    get result(): Promise<string | undefined> {
      return new Promise((resolve, reject) => {
        this.fileReader.onloadend = (e) => {
          const { target } = (e as { target: PlusIoDirectoryEntry & { result?: string } });
          resolve(target.result);
        };
      });
    }

    async readAsDataURL(encoding: string = "utf-8") {
      this.fileReader.readAsDataURL(this.file, encoding);

      return await this.result;
    }

    async readAsText(encoding: string = "utf-8") {
      this.fileReader.readAsText(this.file, encoding);

      return await this.result;
    }
  };
}
