import { parseDOM } from 'dom-renderer';

import { component, on, debounce } from 'web-cell';

import template from './index.html';

const editor = Symbol('Inner editor'),
    store = Symbol('Editor store');

@component({ template })
export default class TextEditor extends HTMLElement {
    constructor() {
        super().construct();
    }

    connectedCallback() {
        this[editor] = document.createElement('div');

        (this[editor].contentEditable = true), (this[editor].dataset.count = 0);

        this.append(this[editor]);

        self.MarkdownIME.Enhance(this[editor]);
    }

    slotChangedCallback() {
        this[store] = this.$slot('textarea')[0];
    }

    get value() {
        return this[editor].innerHTML.trim();
    }

    set value(raw) {
        raw = this[editor].innerHTML = raw.trim();

        if (this[store]) this[store].value = raw;
    }

    @on('input')
    @debounce()
    onInput() {
        const { value } = this;

        this[editor].dataset.count = value.length;

        if (this[store]) this[store].value = value;
    }

    get media() {
        return this.$slot('img, audio, video');
    }

    insertMedia({ files }) {
        if (!files[0]) return;

        const markup = Array.from(files, file => {
            const URI = URL.createObjectURL(file);

            switch (file.type.split('/')[0]) {
                case 'image':
                    return `<img src="${URI}">`;
                case 'audio':
                    return `<audio src="${URI}"></audio>`;
                case 'video':
                    return `<video src="${URI}"></video>`;
            }
        })
            .filter(Boolean)
            .join('\n');

        self.getSelection()
            .getRangeAt(0)
            .insertNode(parseDOM(markup));
    }

    @on('paste')
    onPaste({ clipboardData }) {
        this.insertMedia(clipboardData);
    }

    @on('dragover')
    onDragOver() {
        this[editor].focus();
    }

    @on('drop')
    onDrop(event) {
        event.preventDefault();

        this.insertMedia(event.dataTransfer);
    }
}
