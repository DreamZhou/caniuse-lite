import { walk } from "https://deno.land/std@0.172.0/fs/walk.ts";
import * as path from "https://deno.land/std@0.172.0/path/mod.ts";

const import_dir = path.fromFileUrl(import.meta.url);
const regions_dir = path.join(path.dirname(import_dir), "../../data/regions/");
const walkEntrys = walk(regions_dir, {
    includeDirs: false,
    exts: [".js"]
})

let fileStr = ""

const outFileDir = path.join(regions_dir, "..");
const outFilePath = path.join(outFileDir, "region-data.js");

const regionsKeys = [];
for await (const entry of walkEntrys) {
    const fileName = path.basename(entry.path, ".js");
    if(fileName.includes("-")) {
        const fileName_ = fileName.replaceAll("-", "_");
        fileStr += `import ${fileName_} from "./regions/${fileName}.js";\n`
    } else {
        fileStr += `import ${fileName} from "./regions/${fileName}.js";\n`
    }
    regionsKeys.push(fileName);
}

fileStr += `\nexport default {\n`
regionsKeys.forEach(key => {
    if(key.includes("-")) {
        fileStr += `    "${key}": ${key.replaceAll("-", "_")},\n`;
    } else {
        fileStr += `    ${key},\n`;
    }  
})

fileStr = fileStr.slice(0, -2);
fileStr += "\n};"

Deno.writeTextFile(outFilePath, fileStr);