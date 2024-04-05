

import { CustomError } from "src/apollo/server/utils/customError"
import { GENERAL_ERROR } from "src/apollo/server/utils/errorMessages"
import { createURL } from "../../helpers/FileHelpers"

export const resolvers = {

  Mutation: {

    // Generate pre sign url for upload image
    generatePreSignURL: async (_, { fileUploadPath, type }, { user }) => {
      try {
        const path = fileUploadPath;

        const bucketParams = {
          Bucket: process.env.APP_BUCKET,
          Key: path,

          // ContentType: type,
        };
        const url = await createURL(bucketParams);

        return { url, fileName: path };
      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    },

    // Generate pre sign url for upload image
    generateMultiplePreSignURL: async (_, { fileUploadPath, type }, { user }) => {
      try {

        const presignedUrls = [];

        for (const path of fileUploadPath) {
          const bucketParams = {
            Bucket: process.env.APP_BUCKET,
            Key: path,

            // ContentType: type,
          };
          const url = await createURL(bucketParams);
          presignedUrls.push({ url, fileName: path });
        }

        return presignedUrls;

      } catch (e) {
        throw new CustomError(e.message || GENERAL_ERROR.UNKNOWN, e.code || 500)
      }
    }
  }
}