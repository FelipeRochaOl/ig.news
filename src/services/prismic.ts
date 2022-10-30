import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";

export const repositoryName = "ignews-felipe-rocha";

export function createPrismicClient({
  previewData,
  req,
  ...config
}: prismicNext.CreateClientConfig = {}) {
  return prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    routes: {
      path: "/posts",
      type: "post",
    },
  });
}
