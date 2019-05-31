import { component } from 'web-cell';

import template from './index.html';

@component({ template })
/**
 * @abstract
 */
export default class CascadeSelect extends HTMLElement {
    /**
     * @type {Object}
     */
    static get data() {
        return { fields: [] };
    }

    constructor() {
        super();

        if (this.constructor === CascadeSelect)
            throw TypeError('CascadeSelect is an Abstract class');

        this.construct().then(() =>
            this.on('focus', this.focus.bind(this))
                .on('change', ':host input', this.renderNext.bind(this))
                .renderNext({ target: '' })
        );
    }

    /**
     * @abstract
     *
     * @param {Number}  depth
     * @param {?String} superValue
     *
     * @return   {?Object}
     * @property {?String}  label
     * @property {String[]} list
     */
    /* eslint-disable */
    levelOf(depth, superValue) {
        /* eslint-enable */
        throw ReferenceError(
            this.constructor.name + '#levelOf() must be implemented'
        );
    }

    focus() {
        this.$('input')
            .slice(-1)[0]
            .focus();
    }

    /**
     * @protected
     *
     * @param {Event} event
     */
    async renderNext({ target }) {
        const index = this.$('input').indexOf(target) + 1;

        const { label, list } = (await this.levelOf(index, target.value)) || {},
            { fields } = this.view;

        if (!label && !list) return;

        fields.clear(index);

        await fields.insert({
            index,
            label,
            list: list.map(value => ({ value }))
        });

        this.focus();
    }

    /**
     * @type {String[]}
     */
    get values() {
        return this.$('input')
            .map(({ value }) => value)
            .filter(Boolean);
    }
}
