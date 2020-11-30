import {Controller, Get, Inject, MulterOptions, MultipartFile, PathParams, PlatformResponse, Post, Res} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Returns, Summary} from "@tsed/schema";
import {FileModel} from "../../../models/FileModel";
import {ArchiveService} from "../../../services/achive/ArchiveService";

@Controller("/archive")
export class ArchiveController {
  @Inject()
  archiveService: ArchiveService;

  @Get("/:id/metadata")
  @Summary("Get file metadata")
  @(Returns(200, FileModel).Description("Get file metadata"))
  @(Returns(404).Description("File not found"))
  async getFileInformation(@PathParams("id") id: string) {
    const file = await this.archiveService.findById(id);

    if (!file) {
      throw new NotFound("File not found");
    }

    return file;
  }

  @Get("/:id/download")
  @Summary("Download a file stored in the archive manager")
  @(Returns(200).ContentType("application/octet-stream"))
  @(Returns(404).Description("File not found"))
  async download(@PathParams("id") id: string) {
    const file = await this.getFileInformation(id);

    return Buffer.from(file.content);
  }

  @Get("/:id")
  @Summary("Get file content")
  @(Returns(200, String).Description("The file content"))
  @(Returns(404).Description("File not found"))
  async get(@PathParams("id") id: string, @Res() res: PlatformResponse) {
    const file = await this.getFileInformation(id);

    res.contentType(file.mimeType);

    return file.content;
  }

  @Post("/")
  @Summary("Upload a new file in the archive manager")
  @MulterOptions({
    limits: {
      fileSize: 1024
    }
  })
  @Returns(201, FileModel)
  async add(@MultipartFile("file") file: MultipartFile): Promise<any> {
    return this.archiveService.create({
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      content: file.buffer.toString()
    });
  }

  @Get("/")
  @Summary("Get all stored files")
  @(Returns(200, Array).Of(FileModel))
  getFiles() {
    return this.archiveService.findAll();
  }
}
