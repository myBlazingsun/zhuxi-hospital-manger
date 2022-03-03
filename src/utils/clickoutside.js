import {on, off} from './dom'

const createOutsideFn = (el, binding, vnode)=>{
    var component = vnode.context,
            bindingFn = binding.value;
    on(document, 'mousedown', (e)=>{
        let target = e.target,
        popElement = component.popElement;
        if(!popElement)return
        if(!el.contains(target) &&  !popElement.contains(target)){
            bindingFn && bindingFn()
        }
    })
}

export default {
    bind(el, binding, vnode){
        createOutsideFn(el, binding, vnode) 
    },
    updated(el, binding, vnode) {
        createOutsideFn(el, binding, vnode)       
    },
    unbind(el){
        
    }
}