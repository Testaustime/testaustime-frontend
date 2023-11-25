declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

// TODO: This shouldn't be needed
declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}
