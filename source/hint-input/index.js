(() => {

    const t = document.currentScript.previousElementSibling;

    customElements.define('hint-input',  class HintInput extends HTMLElement {

        constructor() {

            super().attachShadow({
                mode:              'open',
                delegatesFocus:    true
            }).append(
                t.content.cloneNode( true )
            );
        }

        static get observedAttributes() {

            return  ['type', 'label', 'placeholder', 'value'];
        }

        attributeChangedCallback(name, oldValue, newValue) {

            this[ name ] = newValue;
        }

        $(selector) {  return this.shadowRoot.querySelectorAll( selector );  }

        get type() {  return this.$('input')[0].type;  }

        set type(value) {  this.$('input')[0].type = value;  }

        get label() {  return this.$('label')[0].textContent;  }

        set label(raw) {  this.$('label')[0].textContent = raw;  }

        get placeholder() {  return this.$('input')[0].placeholder;  }

        set placeholder(raw) {  this.$('input')[0].placeholder = raw;  }

        get defaultValue() {  return this.getAttribute('value');  }

        get value() {  return this.$('input')[0].value;  }

        set value(raw) {  this.$('input')[0].value = raw;  }

        get options() {  return this.$('datalist')[0].options;  }

        get list() {  return  Array.from(this.options,  node => node.value);  }

        set list(data) {

            if (! (data instanceof Array))  return;

            const staticData = Array.from(
                    this.$('slot')[0].assignedNodes(),
                    node  =>  (node.nodeType === 1)  &&
                        (node.style.display = 'none')  &&  node.value
                ),
                list = this.$('datalist')[0];

            list.innerHTML = '';

            list.append(
                ... staticData.concat( data ).filter( Boolean )
                    .map(value  =>  new Option( value ))
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

            this.$('slot')[0].addEventListener('slotchange',  () => this.list = [ ]);

            const input = this.$('input')[0];

            input.addEventListener('input',  this.load.bind( this ));

            //  Emit "change" event out of shadow root
            input.addEventListener('change',  () =>
                this.shadowRoot.host.dispatchEvent(new Event('change', {
                    bubbles:     true,
                    cancelable:  false
                }))
            );

            this.shadowRoot.host.addEventListener('focus',  () => input.click());
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
})();
