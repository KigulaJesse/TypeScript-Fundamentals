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
		const tagRegex = /<\/?([a-zA-Z0-9-_]+)([^>]*)>|([^<]+)/g;
		const attrRegex = /([a-zA-Z0-9-_]+)="([^"]*)"/g;
		
		const root: XmlNode = new XmlNode("root", {});
		
		const stack: XmlNode[] = [root];
//		console.log(stack);
//		console.log("Boom");

		let match;
		while ((match = tagRegex.exec(xmlString)) !== null){
			const [fullMatch, tagName, attributes, textContent] = match;
			
			if (textContent) {
				const trimmedText = textContent.trim();
				if (trimmedText.length > 0){
					stack[stack.length - 1].textContent += `${trimmedText}`;
				}
			}
			
			else if (tagName.startsWith("/")){
				stack.pop();
			}
			
			else {
				const attrMap: Record<string, string> = {};
				let attrMatch
				while((attrMatch = attrRegex.exec(attributes)) !== Null){
					attrMap[attrMatch[1]] = attrMatch[2];
				}
				
				const node = new XmlNode(tagName, attrMapr);
				stack[stack.length - 1].addChild(node);
				stack.push(node);
			}
			
			return root.children.length > 0 ? root.children[0] : null;
		}
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
console.log();
console.log(tree)
console.log();
if (tree) {
    console.log(tree.toString());
}

