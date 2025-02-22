class XmlNode {
	tagName: string;
	attributes: Record<string, string>;
	children: XmlNode[];
	textContent: string;
	
	constructor(tagName: string, attributes: Record<string, string>, textContent: string = "") {
		this.tagName = tagName;
		this.attributes = attributes;
		this.children = [];
		this.textContent = textContent.trim();
	}
	
	addChild(child: XmlNode){
		this.children.push(child);
	}
	
	toString(indent: number = 0): string {
		const indentation = "  ".repeat(indent);
		const attrs = Object.entries(this.attributes)
			.map(([key, value]) => `${key}="${value}"`)
			.join(" ");
		const openingTag = attrs ? `<${this.tagName} ${attrs}>`: `<${this.tagName}>`;
		if (this.children.length === 0){
			return `${indentation}${openingTag}${this.textContent}</${this.tagName}>`;
		}
		const childrenStr = this.children.map(child => child.toString(indent + 1)).join("\n")
		return `${indentation}${openingTag}\n
					${childrenStr}\n
				${indentation}</${this.tagName}>`
		;
	}
}

class XmlParser{
	static parse(xmlString: string): XmlNode | null {
//        const tagRegex = /<\/?([a-zA-Z0-9-_]+)([^>]*)>|([^<]+)/g;
		const tagRegex = /<\/([a-zA-Z0-9-_]+)>|<([a-zA-Z0-9-_]+)([^>]*)>|([^<]+)/g;
        const attrRegex = /([a-zA-Z0-9-_]+)="([^"]*)"/g;

        const root: XmlNode = new XmlNode("root", {});
        const stack: XmlNode[] = [root];

		let match;
		let x = 0
        while ((match = tagRegex.exec(xmlString)) !== null) {
//    	console.log(match);
    
    	const [fullMatch, closingTag, tagName, attributes, textContent] = match;

    if (textContent) {
        const trimmedText = textContent.trim();
        if (trimmedText.length > 0) {
            stack[stack.length - 1].textContent += ` ${trimmedText}`;
        }
    } else if (closingTag) { // ✅ Correctly detect closing tags
//        console.log(closingTag); // Now this will log </child>, </subchild>, etc.
        stack.pop();
    } else {
        const attrMap: Record<string, string> = {};
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attributes)) !== null) {
            attrMap[attrMatch[1]] = attrMatch[2];
        }

        const node = new XmlNode(tagName, attrMap);
        stack[stack.length - 1].addChild(node);
        stack.push(node);
    }
}
//		console.log("Stack",stack);
		return root.children.length > 0 ? root.children[0] : null;
	}
}

const xmlString = `
<root>
    <child name="first">Hello</child>
    <child name="second">
        <subchild id="1">World</subchild>
    </child>
</root>
`;

const tree = XmlParser.parse(xmlString);
if (tree) {
//	console.log(tree);
	console.log(tree.toString());
}

