import { component } from 'web-cell';

import CascadeSelect from 'cascade-select';

@component()
export default class PathSelect extends CascadeSelect {
    constructor() {
        super();
    }

    levelOf(index, superValue = '') {
        return index > 2
            ? null
            : {
                label: String.fromCharCode(65 + index),
                list: [1, 2, 3].map(n => superValue + n)
            };
    }
}
