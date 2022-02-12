export interface VideoBasic {
  title: string;
  dfLink: string;
  duration: string;
}

export interface VideoDetails extends VideoBasic {
  thumbnail: string;
  tags: Array<string>;
  ytLink: string;
  description: string;
  created: number;
  downloadOptions: Array<{
    format: string;
    videoEncoding: string;
    audioEncoding: string;
    fileSize: string;
    videoId: string;
  }>;
}

export interface DBVideo extends VideoDetails {
  id: string;
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
}