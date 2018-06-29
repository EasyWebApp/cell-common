import {component} from 'web-cell';

import HTML from './index.html';



export default  component(class HintInput extends HTMLElement {

    constructor() {  super().buildDOM( HTML ).view.list = [ ];  }

    static get observedAttributes() {

        return  ['type', 'label', 'placeholder', 'value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        this[ name ] = newValue;
    }

    get type() {  return this.$('input')[0].type;  }

    set type(value) {  this.view.type = value;  }

    get label() {  return this.view.label;  }

    set label(raw) {  this.view.label = raw;  }

    get placeholder() {  return this.view.placeholder;  }

    set placeholder(raw) {  this.view.placeholder = raw;  }

    get defaultValue() {  return this.getAttribute('value');  }

    get value() {  return this.$('input')[0].value;  }

    set value(raw) {  this.view.value = raw;  }

    get options() {  return this.$('datalist')[0].options;  }

    get list() {  return  Array.from(this.options,  node => node.value);  }

    set list(data) {

        if (! (data instanceof Array))  return;

        const staticData = Array.from(
            this.$('slot')[0].assignedNodes(),
            node  =>  (node.nodeType === 1)  &&
                (node.style.display = 'none')  &&  node.value
        );

        this.view.list.clear().render(
            staticData.concat( data ).filter( Boolean ).map(value => ({ value }))
        );
    }

    get src() {  return this.getAttribute('src');  }

    set src(val) {

        if (val)  this.setAttribute('src', val);
    }

    get jsonDes() {  return this.getAttribute('jsonDes');  }

    set jsonDes(val) {

        if (val)  this.setAttribute('jsonDes', val);
    }

    connectedCallback() {

        this.list = [ ];

        this.on.call(this.$('slot')[0],  'slotchange',  () => this.list = [ ]);

        const input = this.$('input')[0];

        this.on('focus',  () => input.click());
    }

    async load() {

        if (! (this.src && this.jsonDes))  return;

        const response = await fetch(this.src, {method: 'get'}),
            jsonKey = this.jsonDes.split('.');

        var data = await response.json(), len = jsonKey.length - 1;

        for (let i = 1;  i < len;  i++)  data = data[ jsonKey[i] ];

        this.list = data.map(value  =>  value[ jsonKey[len] ]);
    }
});
