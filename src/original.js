var XmlNode = /** @class */ (function () {
    function XmlNode(tagName, attributes, textContent) {
        if (textContent === void 0) { textContent = ""; }
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = [];
        this.textContent = textContent.trim();
    }
    XmlNode.prototype.addChild = function (child) {
        this.children.push(child);
    };
    XmlNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        var indentation = "  ".repeat(indent);
        var attrs = Object.entries(this.attributes)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "".concat(key, "=\"").concat(value, "\"");
        })
            .join(" ");
        var openingTag = attrs ? "<".concat(this.tagName, " ").concat(attrs, ">") : "<".concat(this.tagName, ">");
        if (this.children.length === 0 && this.textContent === "") {
            return "".concat(indentation).concat(openingTag, "</").concat(this.tagName, ">");
        }
        if (this.children.length === 0) {
            return "".concat(indentation).concat(openingTag).concat(this.textContent, "</").concat(this.tagName, ">");
        }
        var childrenStr = this.children.map(function (child) { return child.toString(indent + 1); }).join("\n");
        return "".concat(indentation).concat(openingTag, "\n").concat(childrenStr, "\n").concat(indentation, "</").concat(this.tagName, ">");
    };
    return XmlNode;
}());
var XmlParser = /** @class */ (function () {
    function XmlParser() {
    }
    XmlParser.parse = function (xmlString) {
        var tagRegex = /<\/([a-zA-Z0-9-_]+)>|<([a-zA-Z0-9-_]+)([^>]*)>|([^<]+)/g;
        var attrRegex = /([a-zA-Z0-9-_]+)="([^"]*)"/g;
        var match;
        var stack = [];
        var root = null;
        while ((match = tagRegex.exec(xmlString)) !== null) {
            console.log(match);
            var fullMatch = match[0], closingTag = match[1], openingTag = match[2], attributes = match[3], textContent = match[4];
            if (textContent) {
                var trimmedText = textContent.trim();
                if (trimmedText.length > 0 && stack.length > 0) {
                    stack[stack.length - 1].textContent += " ".concat(trimmedText);
                }
            }
            else if (closingTag) {
                console.log("Closing Tag Found: ".concat(closingTag));
                stack.pop(); // ✅ Correctly pop stack for closing tags
            }
            else if (openingTag) {
                console.log("Opening Tag Found: ".concat(openingTag));
                // Parse attributes
                var attrMap = {};
                var attrMatch = void 0;
                while ((attrMatch = attrRegex.exec(attributes)) !== null) {
                    attrMap[attrMatch[1]] = attrMatch[2];
                }
                var node = new XmlNode(openingTag, attrMap);
                if (stack.length > 0) {
                    stack[stack.length - 1].addChild(node);
                }
                else {
                    root = node;
                }
                if (!fullMatch.endsWith("/>")) {
                    stack.push(node);
                }
            }
        }
        return root;
    };
    return XmlParser;
}());
// Example XML String
var xmlString = "\n<root>\n    <child name=\"first\">Hello</child>\n    <child name=\"second\">\n        <subchild id=\"1\">World</subchild>\n    </child>\n</root>\n";
var tree = XmlParser.parse(xmlString);
if (tree) {
    console.log(tree.toString());
}
