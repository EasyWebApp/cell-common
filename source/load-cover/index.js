import { component, mapProperty, mapData } from 'web-cell';

import template from './index.html';

@component({ template })
export default class LoadCover extends HTMLElement {
    constructor() {
        super().construct();
    }

    @mapProperty
    static get observedAttributes() {
        return ['open'];
    }

    @mapData
    attributeChangedCallback() {}
}
