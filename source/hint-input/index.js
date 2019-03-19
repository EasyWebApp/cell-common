import { component, mapProperty, mapData, on, request } from 'web-cell';

import template from './index.html';

const _proxy_ = Symbol('Proxy input');

@component({ template })
export default class HintInput extends HTMLElement {
    constructor() {
        super()
            .construct()
            .then(() => (this[_proxy_] = this.$('input')[0]));
    }

    @mapProperty
    static get observedAttributes() {
        return ['type', 'label', 'placeholder', 'value'];
    }

    @mapData
    attributeChangedCallback() {}

    get type() {
        return this[_proxy_].type;
    }

    get defaultValue() {
        return this.getAttribute('value');
    }

    set value(value) {
        this[_proxy_].value = value;
    }

    get value() {
        return this[_proxy_].value;
    }

    get options() {
        return this.$('datalist')[0].options;
    }

    get list() {
        return this.view.list.map(item => item.value);
    }

    set list(data) {
        if (!(data instanceof Array)) return;

        const staticData = Array.from(
            this.$('slot')[0].assignedNodes(),
            node => node.nodeType === 1 && (node.hidden = true) && node.value
        );

        this.view.list = staticData
            .concat(data)
            .filter(Boolean)
            .map(value => ({ value }));
    }

    get src() {
        return this.getAttribute('src');
    }

    set src(val) {
        if (val) this.setAttribute('src', val);
    }

    get jsonDes() {
        return this.getAttribute('jsonDes');
    }

    set jsonDes(val) {
        if (val) this.setAttribute('jsonDes', val);
    }

    connectedCallback() {
        this.list = [];

        this.on('focus', () => this[_proxy_].click());
    }

    slotChangedCallback() {
        this.list = [];
    }

    @on('input', ':host input')
    async load() {
        var { src, jsonDes } = this;

        if (!(src && jsonDes)) return;

        var { body } = await request(src);

        jsonDes = jsonDes.split('.');

        var len = jsonDes.length - 1;

        for (let i = 1; i < len; i++) body = body[jsonDes[i]];

        this.list = body.map(value => value[jsonDes[len]]);
    }
}
