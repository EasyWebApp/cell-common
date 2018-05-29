const t = document.currentScript.previousElementSibling;

class HintInput extends HTMLElement {
    constructor() {
        super();
        this._eventHandler = this._eventHandler.bind(this);

    }

    get label() {
        return this.getAttribute('label');
    }
    set label(val) {
        if (val) {
            this.setAttribute('label', val);
        }
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }
    set placeholder(val) {
        if (val) {
            this.setAttribute('placeholder', val);
        }
    }

    get src() {
        return this.getAttribute('src');
    }
    set src(val) {
        if (val) {
            this.setAttribute('src', val);
        }
    }

    get selectOption() {
        return this.getAttribute('selectOption');
    }

    get jsonDes() {
        return this.getAttribute('jsonDes');
    }
    set jsonDes(val) {
        if (val) {
            this.setAttribute('jsonDes', val);
        }
    }

    getSrcJson(str,jsonKey,parent){
        fetch(str,{method:'get'})
            .then(function(response) {
                try {
                    return  response.json();
                } catch (e) {
                    console.log("返回值应该是一个json对象");
                }
            })
            .then(function(cur) {
                let obj = cur,
                    len = jsonKey.length-1;
                for (let i=1;i<len;i++){
                    obj = obj[jsonKey[i]];
                }
                obj.map((value) => {
                    parent.append(new Option(value[jsonKey[len]]));
                })
            });
    }

    appendOption(parent,optionValue) {
        let option = [];
        optionValue.map((value) => {
            parent.append(new Option(value));
        });
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const instance = t.content.cloneNode(true);
        shadowRoot.appendChild(instance);

        const input = shadowRoot.querySelector('.listInput');
        const datalist = shadowRoot.querySelector('#data-list');
        const label2 = shadowRoot.querySelector('label');
        this.ele = input;
        this.ele2 =shadowRoot;
        //使用slot的方法实现下面数据的填充
        const slot = shadowRoot.querySelector('slot');
        let optionArr = [];
        let optionList = slot.assignedNodes();
        for(let i=1;i<optionList.length;i=i+2){
            //让slot里面的option节点，display变为none，因为assignedNodes选出来的元素是text和option，这里就简单的以index作为判断的依据了
            optionList[i].style.display = "none";
            optionArr[((i-1)/2)] = optionList[i].value;
        }
        this.appendOption(datalist,optionArr);

        //使用src属性获得option的值

        let srcAdd = this.getAttribute('src');
        let jsonDes = this.getAttribute("jsonDes");
        if(jsonDes&&srcAdd){
            let jsonKey = jsonDes.split(".");
            this.getSrcJson(srcAdd,jsonKey,datalist);
        }
        //修改label标签的值
        label2.innerText = this.getAttribute('label');

        //修改placeholder的值
        input.setAttribute('placeholder',this.placeholder);

        //修改input的value值为mydatalist的value值
        input.addEventListener("change",() => {
            //debugger;
            //创建一个监听事件
            this._eventHandler(input.value);
            const event = new Event('change');
            event.initEvent('change', true, false);
            this.ele2.host.dispatchEvent( event );
        },false);
    }
    attributeChangedCallback(selectOption, oldVal, newVal){
        console.log(this.selectOption);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        //修改input的value值为mydatalist的value值
        this.ele.addEventListener("change",() => {
            this._eventHandler(input.value)},false);
    }
    _eventHandler(val){
        this.setAttribute('selectOption', val);
        // console.log(this.selectOption);
    }
}

customElements.define('hint-input', HintInput);
