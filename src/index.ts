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

  private pathToParseUrl(path: string): URL {
    return new URL(this.parseUrl + path);
  }

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

    return fetch(this.pathToParseUrl(path))
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
      .catch((e: Error) => Promise.reject(e));
  }

  public url(itemOrPath: IDakaItem | string): string {
    return this.baseUrl + (typeof itemOrPath === "string" ? itemOrPath : itemOrPath.path);
  }

  public async queue(itemOrUrl: IDakaItem | string): Promise<Response> {
    const body = typeof itemOrUrl === "string" ? `external_url = ${itemOrUrl}` : `url=${itemOrUrl.path}`;
    return fetch(this.pathToParseUrl(this.queuePath), {
      method: "PUSH",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }
}
