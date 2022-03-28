declare module "parse-apache-directory-index" {
  export interface IApacheContent {
    type: "directory" | "file";
    name: string;
    path: string;
    lastModified: Date;
    size: number | null;
  }

  export interface IApacheDirectory {
    dir: string;
    files: IApacheContent[];
  }

  const parse: (html: string) => IApacheDirectory;

  export default parse;
}
