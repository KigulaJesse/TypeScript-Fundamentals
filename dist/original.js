"use strict";
class XmlNode {
    constructor(tagName, attributes, textContent = "") {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = [];
        this.textContent = textContent.trim();
    }
    addChild(child) {
        this.children.push(child);
    }
    toString(indent = 0) {
        const indentation = "  ".repeat(indent);
        const attrs = Object.entries(this.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ");
        const openingTag = attrs ? `<${this.tagName} ${attrs}>` : `<${this.tagName}>`;
        if (this.children.length === 0 && this.textContent === "") {
            return `${indentation}${openingTag}</${this.tagName}>`;
        }
        if (this.children.length === 0) {
            return `${indentation}${openingTag}${this.textContent}</${this.tagName}>`;
        }
        const childrenStr = this.children.map(child => child.toString(indent + 1)).join("\n");
        return `${indentation}${openingTag}\n${childrenStr}\n${indentation}</${this.tagName}>`;
    }
}
class XmlParser {
    static parse(xmlString) {
        const tagRegex = /<\/([a-zA-Z0-9-_]+)>|<([a-zA-Z0-9-_]+)([^>]*)>|([^<]+)/g;
        const attrRegex = /([a-zA-Z0-9-_]+)="([^"]*)"/g;
        let match;
        const stack = [];
        let root = null;
        while ((match = tagRegex.exec(xmlString)) !== null) {
            console.log(match);
            const [fullMatch, closingTag, openingTag, attributes, textContent] = match;
            if (textContent) {
                const trimmedText = textContent.trim();
                if (trimmedText.length > 0 && stack.length > 0) {
                    stack[stack.length - 1].textContent += ` ${trimmedText}`;
                }
            }
            else if (closingTag) {
                console.log(`Closing Tag Found: ${closingTag}`);
                stack.pop(); // ✅ Correctly pop stack for closing tags
            }
            else if (openingTag) {
                console.log(`Opening Tag Found: ${openingTag}`);
                // Parse attributes
                const attrMap = {};
                let attrMatch;
                while ((attrMatch = attrRegex.exec(attributes)) !== null) {
                    attrMap[attrMatch[1]] = attrMatch[2];
                }
                const node = new XmlNode(openingTag, attrMap);
                if (stack.length > 0) {
                    stack[stack.length - 1].addChild(node);
                }
                else {
                    root = node;
                }
                if (!fullMatch.endsWith("/>")) {
                    stack.push(node);
                }
                //sjajak
            }
        }
        return root;
    }
}
// Example XML String
const xmlString = `
<root>
    Test
    <child name="first">Hello</child>
    <child name="second">
        <subchild id="1">World</subchild>
    </child>
</root>
`;
const tree = XmlParser.parse(xmlString);
if (tree) {
    console.log(tree);
    console.log(tree.toString());
}
