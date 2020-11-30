import {Injectable} from "@tsed/common";
import {FileModel} from "../../models/FileModel";
import {MemoryCollection} from "../../utils/MemoryCollection";

@Injectable()
export class ArchiveService extends MemoryCollection<FileModel> {
  constructor() {
    super(FileModel);
  }

  findById(id: string) {
    return this.findOne({_id: id});
  }
}
