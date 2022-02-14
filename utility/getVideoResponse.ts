import { DBVideo, VideoDetails } from "./interface";

export const getVideoValue = ({
  id,
  title,
  duration,
  thumbnail,
  dfLink,
  ytLink,
  description,
  tags,
  downloadOptions,
  created,
}: DBVideo) => ({
  id,
  title,
  duration,
  thumbnail,
  dfLink,
  ytLink,
  description,
  tags,
  downloadOptions,
  created,
} as VideoDetails);

export const getVideoValues = () => (dbData: DBVideo) => getVideoValue(dbData);