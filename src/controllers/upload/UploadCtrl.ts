import {Controller, Put, Status, UseBefore, Returns} from "@tsed/common";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
import {BeforeMiddleware} from "../../middlewares/BeforeMiddleware";

@Controller("/upload")
@UseBefore(BeforeMiddleware, {})
export class UploadController {
  @Put("/")
  @Returns(201, {description: "Created"})
  @MulterOptions({dest: `${process.cwd()}/.tmp`})
  async add(@MultipartFile("file") file: Express.Multer.File): Promise<any> {
    return true;
  }
}
