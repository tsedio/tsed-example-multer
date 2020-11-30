import {PlatformTest} from "@tsed/common";
import {ArchiveService} from "./ArchiveService";

describe("ArchiveService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return file by ID", async () => {
    const service = PlatformTest.get<ArchiveService>(ArchiveService);

    service.create({
      name: "name"
    });

    const item = await service.findOne({})!;

    expect(service.findById(item._id)).toEqual(item);
  });
});
