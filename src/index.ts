import parseApacheDirectory, { IApacheContent } from "parse-apache-directory-index";
import fetch, { Response } from "node-fetch";

export interface IDakaItem {
  title: string;
  path: string;
  isFile: boolean;
}

export default class DakaNu {
  public readonly baseUrl: string;
  public readonly parseUrl: string;
  public readonly filesPath: string;
  public readonly soundsPath: string;
  private readonly queuePath: string = "/soundboard/queue.php";

  constructor(o: { baseUrl: string; parseUrl?: string; filesPath?: string; soundsPath?: string }) {
    this.baseUrl = o.baseUrl;
    this.parseUrl = o.parseUrl || o.baseUrl;
    this.filesPath = o.filesPath || "/files/";
    this.soundsPath = o.soundsPath || "/soundboard/sounds/";
  }

  private isUrl = (urlOrPath: string): boolean => /^[a-z][a-z0-9+.-]*:/.test(urlOrPath);

  public async files(): Promise<IDakaItem[]> {
    return this.search(this.filesPath);
  }

  public async sounds(): Promise<IDakaItem[]> {
    return this.search(this.soundsPath);
  }

  /**
   * Parses dåka.nu Apache directroy listings.
   *
   * @param path The path to the directory to look into.
   * @returns The files and folders inside the directory.
   */
  public async search(path: string): Promise<IDakaItem[]> {
    if (!path.endsWith("/")) {
      return [];
    }

    return fetch(this.parseUrl + path)
      .then(res => res.text())
      .then(html => {
        const a: IDakaItem[] = parseApacheDirectory(html).files.map((item: IApacheContent) => ({
          title: item.name,
          // Sometimes the path is not encoded correctly, so have to do it manually just in case
          // Only give the path, not the full url
          path: new URL(this.baseUrl + item.path).pathname,
          isFile: item.type === "file",
        }));

        return [
          {
            title: "Parent Directory",
            path: path.split("/").slice(0, -2).join("/") + "/",
            isFile: false,
          },
        ].concat(a);
      })
      .catch(() => []);
  }

  public url(itemOrPath: IDakaItem | string): string {
    return this.baseUrl + (typeof itemOrPath === "string" ? itemOrPath : itemOrPath.path);
  }

  public async filesOnly(items: IDakaItem[]): Promise<IDakaItem[]> {
    let a: IDakaItem[] = [];

    for (const item of items) {
      if (item.isFile) a.push(item);
      else a = a.concat(await this.filesOnly((await this.search(item.path)).slice(1)));
    }

    return a;
  }

  public async queue(itemOrPathOrUrl: IDakaItem | string): Promise<Response> {
    const p = typeof itemOrPathOrUrl === "string" ? itemOrPathOrUrl : itemOrPathOrUrl.path;
    const url = this.isUrl(p) ? p : `${this.baseUrl}${p}`;
    const body = `external_url=${url}`;
    return fetch(this.baseUrl + this.queuePath, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }
}
