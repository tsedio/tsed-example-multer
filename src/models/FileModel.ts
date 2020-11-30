import {Description, Ignore, Name} from "@tsed/schema";

export class FileModel {
  @Name("id")
  @Description("Uniq file ID")
  _id: string;

  @Description("The file name")
  name: string;

  @Description("The mimeType file")
  mimeType: string;

  @Description("The file size")
  size: number;

  @Ignore()
  content: string;
}
