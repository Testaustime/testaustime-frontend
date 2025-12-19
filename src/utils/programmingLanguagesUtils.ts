import { capitalizeFirstLetter, isStringNull } from "./stringUtils";

// Create "synonyms" for the programming language names.
// The values will be used to get the language's name in `prettifyProgrammingLanguageName`
const normalizedNames = new Map(
  Object.entries({
    cs: "csharp",
    ts: "typescript",
    tsx: "typescriptreact",
    js: "javascript",
    jsx: "javascriptreact",
    perl6: "perl",
    jade: "pug",
    gitcommit: "git-commit",
    gitrebase: "git-rebase",
    shellscript: "sh",
    make: "makefile",
  }),
);

export const normalizeProgrammingLanguageName = (
  name: string | undefined | null,
) => {
  if (!name || isStringNull(name)) return null;
  return normalizedNames.get(name) || name;
};

const languageNames = new Map(
  Object.entries({
    typescript: "TypeScript",
    typescriptreact: "TypeScript with React",
    javascript: "JavaScript",
    javascriptreact: "JavaScript with React",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    rust: "Rust",
    vimwiki: "VimWiki",
    abap: "ABAP",
    bat: "Windows Batch",
    bibtex: "BibTeX",
    coffeescript: "CoffeeScript",
    cpp: "C++",
    csharp: "C#",
    "cuda-cpp": "CUDA C++",
    fsharp: "F#",
    "git-commit": "Git Commit",
    "git-rebase": "Git Rebase",
    jsonc: "JSON with Comments",
    latex: "LaTeX",
    "objective-c": "Objective-C",
    "objective-cpp": "Objective-C++",
    php: "PHP",
    plaintext: "Plain Text",
    powershell: "PowerShell",
    scss: "SCSS",
    sass: "SASS",
    shaderlab: "ShaderLab",
    sh: "Shell Script",
    sql: "SQL",
    text: "TeX",
    vb: "Visual Basic",
    "vue-html": "Vue HTML",
    xml: "XML",
    xsl: "XSL",
    yaml: "YAML",
    toml: "TOML",
    cabalconfig: "Cabal Config",
    zsh: "ZSH",
    nginx: "NGINX",
    sshconfig: "SSH Config",
    conf: "Config",
    dockercompose: "Docker Compose",
    mdx: "Markdown Extended",
  }),
);

export const prettifyProgrammingLanguageName = (
  name: string | undefined | null,
) => {
  if (!name || isStringNull(name)) return null;

  return languageNames.get(name) || capitalizeFirstLetter(name);
};
