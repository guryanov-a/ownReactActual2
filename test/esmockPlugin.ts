import { plugin } from "bun";
import path from 'path';

plugin({
  name: "esmock loader",
  async setup(build) {
    const { getSource } = await import("esmock/src/esmockLoader.js");

    // when js files are loaded
    build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async ({ path: filePath }) => {
      // read and compile it with esmock
      const contents = await getSource(filePath);

      // Determine the file extension
      const extension = path.extname(filePath);

      // and return the compiled source code as filtered extension
      return {
        contents,
        loader: extension.substring(1),
      };
    });
  },
});