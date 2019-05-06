export const HTML2MD = new self.TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    linkStyle: 'referenced'
});

HTML2MD.use(self.turndownPluginGfm.gfm)
    .addRule('non_url', {
        filter(node) {
            return (
                ['a', 'area'].includes(node.nodeName.toLowerCase()) &&
                /^javascript:/.test(node.getAttribute('href'))
            );
        },
        replacement: (content, node) => content.trim() || node.title.trim()
    })
    .addRule('asset_code', {
        filter: ['style', 'script'],
        replacement: () => ''
    });
