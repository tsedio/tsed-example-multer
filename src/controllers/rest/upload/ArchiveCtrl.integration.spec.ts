import {PlatformTest} from "@tsed/common";
import * as faker from "faker";
import {existsSync} from "fs";
import SuperTest from "supertest";
import {Server} from "../../../Server";
import {ArchiveController} from "./ArchiveCtrl";

const filePath = `${__dirname}/__mock__/file.txt`;

if (!existsSync(filePath)) {
  throw "File test doesn't exists";
}

async function uploadFileFixture(request: SuperTest.SuperTest<SuperTest.Test>) {
  return request.post("/rest/archive").attach("file", filePath).expect(201);
}

describe("ArchiveCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/rest": [ArchiveController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  describe("POST /rest/archive (Upload file)", () => {
    it("should upload a file", async () => {
      const result = await uploadFileFixture(request);

      expect(result.body).toEqual({
        id: expect.any(String),
        mimeType: "text/plain",
        name: "file.txt",
        size: 11
      });
    });
  });

  describe("GET /rest/archive/:id (Get content)", () => {
    it("should get file content", async () => {
      const {body: file} = await uploadFileFixture(request);

      const response = await request.get(`/rest/archive/${file.id}`).expect(200);

      expect(response.headers["content-type"]).toEqual("text/plain; charset=utf-8");
      expect(response.headers["content-length"]).toEqual("11");
    });

    it("should throw NOT FOUND FILE", async () => {
      const response = await request.get(`/rest/archive/${faker.random.uuid()}`).expect(404);

      expect(response.body).toEqual({
        errors: [],
        message: "File not found",
        name: "NOT_FOUND",
        status: 404
      });
    });
  });

  describe("GET /rest/archive/:id/metadata (Get metadata)", () => {
    it("should get file metadata", async () => {
      const {body: file} = await uploadFileFixture(request);

      const response = await request.get(`/rest/archive/${file.id}/metadata`).expect(200);

      expect(response.body).toEqual(file);
    });

    it("should throw NOT FOUND FILE", async () => {
      const response = await request.get(`/rest/archive/${faker.random.uuid()}/metadata`).expect(404);

      expect(response.body).toEqual({
        errors: [],
        message: "File not found",
        name: "NOT_FOUND",
        status: 404
      });
    });
  });

  describe("GET /rest/:id/download (Force download)", () => {
    it("should force download", async () => {
      const {body: file} = await uploadFileFixture(request);

      const response = await request.get(`/rest/archive/${file.id}/download`).expect(200);

      expect(response.headers["content-type"]).toEqual("application/octet-stream; charset=utf-8");
      expect(response.headers["content-length"]).toEqual("11");
    });

    it("should throw NOT FOUND FILE", async () => {
      const response = await request.get(`/rest/archive/${faker.random.uuid()}/download`).expect(404);

      expect(response.body).toEqual({
        errors: [],
        message: "File not found",
        name: "NOT_FOUND",
        status: 404
      });
    });
  });

  describe("GET /rest/archive (Get all files)", () => {
    it("should upload a file", async () => {
      const result = await uploadFileFixture(request);

      const {body} = await request.get(`/rest/archive`).expect(200);

      expect(body).toBeInstanceOf(Array);
      expect(body.filter((file: any) => file.id === result.body.id)).toEqual([result.body]);
    });
  });
});
