/**
 * Repair empty `()` that were stripped from inline <script> blocks in HTML pages.
 * Run: node scripts/fix-empty-parens.js
 */
const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "..", "pages");

function fixJs(js) {
  // Arrow functions with no params
  js = js.replace(/,\s*=>/g, ", () =>");
  js = js.replace(/=\s*=>/g, "= () =>");
  js = js.replace(/\(\s*=>/g, "(() =>");

  // function () { and (function () {
  js = js.replace(/\(function\s+\{/g, "(function () {");
  js = js.replace(/([^A-Za-z0-9_$])function\s+\{/g, "$1function () {");
  js = js.replace(/^function\s+\{/gm, "function () {");

  // Named zero-arg functions: function foo {
  js = js.replace(/function\s+([A-Za-z_$][\w$]*)\s+\{/g, "function $1() {");

  // Chainable zero-arg methods mid-expression: .trim. .toLowerCase. etc.
  js = js.replace(
    /\.(trim|toLowerCase|toUpperCase|getBoundingClientRect|preventDefault|stopPropagation|focus|blur|click|select)\./g,
    ".$1()."
  );

  // Zero-arg methods as statements: .preventDefault; .focus;
  js = js.replace(
    /\.(trim|toLowerCase|toUpperCase|getBoundingClientRect|preventDefault|stopPropagation|focus|blur|click|select)\s*;/g,
    ".$1();"
  );

  // Comparison / bare property that should be a call: .toLowerCase ===
  js = js.replace(/\.(toLowerCase|toUpperCase|trim)\s*(===|!==|==|!=|\))/g, ".$1() $2");

  // Standalone local function calls used as statements
  // e.g. close; render; apply; open; toggle; positionDropdown;
  js = js.replace(
    /(^|[\s;{(\?:,])(close|open|render|apply|toggle|positionDropdown|ensureRoomBelow|closePopover|setCounts|cards)\s*;/gm,
    "$1$2();"
  );

  // else open; / else close; already covered
  // if (...) close; else open; — covered by statement pattern

  // Ternary-ish: if (x) close; else open; — handled

  // Fix `const all = cards;` when cards is a function getter — housekeeping
  js = js.replace(/const all = cards;/g, "const all = cards();");
  // cards.forEach when cards is () => array — should be cards().forEach
  // Only in housekeeping pattern after we made cards a function
  js = js.replace(/cards\.forEach/g, "cards().forEach");
  // Avoid double: cards().forEach already if we run twice - use careful pattern
  js = js.replace(/cards\(\)\(\)/g, "cards()");

  // IIFE invocation: script that starts with (function and ends with });
  const trimmed = js.trim();
  if (/^\(function\s*\(\)\s*\{/.test(trimmed) && /\}\);\s*$/.test(trimmed) && !/\}\)\(\);\s*$/.test(trimmed)) {
    // Only convert the final `});` of the outer IIFE.
    // For nested forEach+IIFE ending with `});\n  });`, the OUTER one needs })();
    const last = js.lastIndexOf("});");
    if (last !== -1) {
      // Count how many `});` near the end
      const endChunk = js.slice(-80);
      if ((endChunk.match(/\}\);/g) || []).length >= 2) {
        // guests style: inner }); then outer });
        js = js.slice(0, last) + "})();" + js.slice(last + 3);
      } else {
        js = js.slice(0, last) + "})();" + js.slice(last + 3);
      }
    }
  }

  return js;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const next = original.replace(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    const fixed = fixJs(body);
    if (fixed !== body) changed = true;
    return `<script${attrs}>${fixed}</script>`;
  });
  if (changed) {
    fs.writeFileSync(filePath, next);
    console.log("fixed", path.basename(filePath));
  } else {
    console.log("ok    ", path.basename(filePath));
  }
}

for (const name of fs.readdirSync(pagesDir)) {
  if (!name.endsWith(".html")) continue;
  processFile(path.join(pagesDir, name));
}

console.log("done");
