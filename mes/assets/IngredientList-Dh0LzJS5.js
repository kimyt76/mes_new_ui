import{B as G,a5 as D,e as h,o as b,q as L,m as f,r as Z,h as u,p as n,g as U,w as A,t as k,n as ee,i as te,j as ne,l as w,a6 as oe,T as le,R as ae,a as se,f as ie,A as m,W as z,H as M,F as O,u as F,G as T,K as re,L as de,P as ue,a7 as pe,N as ce,a0 as S}from"./index-BCdxernO.js";import{c as ge,d as fe,b as me,a as be,s as ve}from"./index-Z2YNGKhZ.js";import{s as ye}from"./index-BdHtouln.js";import{s as he}from"./index-D49h5Cbk.js";import{_ as R}from"./FormatFiled-DaFp4UAA.js";import{s as we}from"./index-BE87lW_G.js";import{A as j}from"./apiCommon-DQdCmI3G.js";import{A as B}from"./apiLab-DBKUW3x6.js";import{i as W}from"./common-Ctgf_4Dl.js";import{a as xe}from"./index-WWuz9eST.js";import"./index-CKfU0QJd.js";import"./index-BGn1OEmN.js";import"./index-DhHuXiFi.js";import"./index-CLRf2YcQ.js";import"./index-Dsa_8OmY.js";var Ce=`
    .p-checkbox-group {
        display: inline-flex;
    }
`,$e={root:"p-checkbox-group p-component"},Ve=G.extend({name:"checkboxgroup",style:Ce,classes:$e}),ke={name:"BaseCheckboxGroup",extends:xe,style:Ve,provide:function(){return{$pcCheckboxGroup:this,$parentInstance:this}}},H={name:"CheckboxGroup",extends:ke,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(t){this.groupName=t||D("checkbox-group-")}},mounted:function(){this.groupName=this.groupName||D("checkbox-group-")}};function Ne(e,t,a,s,p,i){return b(),h("div",f({class:e.cx("root")},e.ptmi("root")),[L(e.$slots,"default")],16)}H.render=Ne;var _e=`
    .p-fieldset {
        background: dt('fieldset.background');
        border: 1px solid dt('fieldset.border.color');
        border-radius: dt('fieldset.border.radius');
        color: dt('fieldset.color');
        padding: dt('fieldset.padding');
        margin: 0;
    }

    .p-fieldset-legend {
        background: dt('fieldset.legend.background');
        border-radius: dt('fieldset.legend.border.radius');
        border-width: dt('fieldset.legend.border.width');
        border-style: solid;
        border-color: dt('fieldset.legend.border.color');
        padding: dt('fieldset.legend.padding');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend {
        padding: 0;
    }

    .p-fieldset-toggle-button {
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        text-decoration: none;
        display: flex;
        gap: dt('fieldset.legend.gap');
        align-items: center;
        justify-content: center;
        padding: dt('fieldset.legend.padding');
        background: transparent;
        border: 0 none;
        border-radius: dt('fieldset.legend.border.radius');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
        outline-color: transparent;
    }

    .p-fieldset-legend-label {
        font-weight: dt('fieldset.legend.font.weight');
    }

    .p-fieldset-toggle-button:focus-visible {
        box-shadow: dt('fieldset.legend.focus.ring.shadow');
        outline: dt('fieldset.legend.focus.ring.width') dt('fieldset.legend.focus.ring.style') dt('fieldset.legend.focus.ring.color');
        outline-offset: dt('fieldset.legend.focus.ring.offset');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover {
        color: dt('fieldset.legend.hover.color');
        background: dt('fieldset.legend.hover.background');
    }

    .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.color');
        transition: color dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.hover.color');
    }

    .p-fieldset-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-fieldset-content-wrapper {
        min-height: 0;
    }

    .p-fieldset-content {
        padding: dt('fieldset.content.padding');
    }
`,Ie={root:function(t){var a=t.props;return["p-fieldset p-component",{"p-fieldset-toggleable":a.toggleable}]},legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},Pe=G.extend({name:"fieldset",style:_e,classes:Ie}),Se={name:"BaseFieldset",extends:se,props:{legend:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:null,default:null}},style:Pe,provide:function(){return{$pcFieldset:this,$parentInstance:this}}},q={name:"Fieldset",extends:Se,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(t){this.d_collapsed=t}},methods:{toggle:function(t){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:t,value:this.d_collapsed})},onKeyDown:function(t){(t.code==="Enter"||t.code==="NumpadEnter"||t.code==="Space")&&(this.toggle(t),t.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.legend},dataP:function(){return ie({toggleable:this.toggleable})}},directives:{ripple:ae},components:{PlusIcon:fe,MinusIcon:ge}};function N(e){"@babel/helpers - typeof";return N=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},N(e)}function E(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(p){return Object.getOwnPropertyDescriptor(e,p).enumerable})),a.push.apply(a,s)}return a}function K(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?E(Object(a),!0).forEach(function(s){Le(e,s,a[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):E(Object(a)).forEach(function(s){Object.defineProperty(e,s,Object.getOwnPropertyDescriptor(a,s))})}return e}function Le(e,t,a){return(t=Oe(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Oe(e){var t=je(e,"string");return N(t)=="symbol"?t:t+""}function je(e,t){if(N(e)!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var s=a.call(e,t);if(N(s)!="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}var Be=["data-p"],De=["data-p"],Ue=["id"],Ae=["id","aria-controls","aria-expanded","aria-label"],Fe=["id","aria-labelledby"];function Ee(e,t,a,s,p,i){var v=Z("ripple");return b(),h("fieldset",f({class:e.cx("root"),"data-p":i.dataP},e.ptmi("root")),[u("legend",f({class:e.cx("legend"),"data-p":i.dataP},e.ptm("legend")),[L(e.$slots,"legend",{toggleCallback:i.toggle},function(){return[e.toggleable?U("",!0):(b(),h("span",f({key:0,id:e.$id+"_header",class:e.cx("legendLabel")},e.ptm("legendLabel")),k(e.legend),17,Ue)),e.toggleable?A((b(),h("button",f({key:1,id:e.$id+"_header",type:"button","aria-controls":e.$id+"_content","aria-expanded":!p.d_collapsed,"aria-label":i.buttonAriaLabel,class:e.cx("toggleButton"),onClick:t[0]||(t[0]=function(){return i.toggle&&i.toggle.apply(i,arguments)}),onKeydown:t[1]||(t[1]=function(){return i.onKeyDown&&i.onKeyDown.apply(i,arguments)})},K(K({},e.toggleButtonProps),e.ptm("toggleButton"))),[L(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:p.d_collapsed,class:ee(e.cx("toggleIcon"))},function(){return[(b(),te(ne(p.d_collapsed?"PlusIcon":"MinusIcon"),f({class:e.cx("toggleIcon")},e.ptm("toggleIcon")),null,16,["class"]))]}),u("span",f({class:e.cx("legendLabel")},e.ptm("legendLabel")),k(e.legend),17)],16,Ae)),[[v]]):U("",!0)]})],16,De),n(le,f({name:"p-collapsible"},e.ptm("transition")),{default:w(function(){return[A(u("div",f({id:e.$id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":e.$id+"_header"},e.ptm("contentContainer")),[u("div",f({class:e.cx("contentWrapper")},e.ptm("contentWrapper")),[u("div",f({class:e.cx("content")},e.ptm("content")),[L(e.$slots,"default")],16)],16)],16,Fe),[[oe,!p.d_collapsed]])]}),_:3},16)],16,Be)}q.render=Ee;const Ke={class:"card flex flex-col w-full bg-gray-100 py-2 h-[480px]"},Ge={class:"w-full py-0 gap-2"},ze={class:"card flex flex-row justify-between items-center gap-5 mt-3"},Me=["for"],Te=["for"],Re={class:"flex justify-end gap-2"},We={__name:"IngredientPop",props:{title:{type:String},id:{type:String}},emits:["saved","close-visible"],setup(e,{emit:t}){const a=t,s=m([]),p=m([]),i=m([]),v=m([]),r=z({krIngredientName:"",enIngredientName:"",cnIngredientName:"",casNo:"",functionCd:"",etc:""}),$=e,_=async()=>{const x={...r,limitCountries:i.value,bannedCountries:v.value};try{const l=await B.saveIngredientInfo(x);a("saved",l),a("close-dialog")}catch(l){vError(l.message)}};return M(async()=>{if(s.value=await j.getCodeList("fn_Cd"),p.value=await j.getCodeList("country_cd"),console.log("props.id",$.id),!W($.id)){const x=await B.getIngredientInfo($.id);console.log("result",x),Object.assign(r,x),i.value=x.limitCountries,v.value=x.bannedCountries}}),(x,l)=>{const c=R,I=me,y=H,d=q,P=T;return b(),h(O,null,[u("div",Ke,[u("div",Ge,[n(c,{modelValue:r.krIngredientName,"onUpdate:modelValue":l[0]||(l[0]=o=>r.krIngredientName=o),type:"text",label:"국문성분명",class:"w-full mt-3",style:{width:"100%"},size:"lg"},null,8,["modelValue"]),n(c,{modelValue:r.enIngredientName,"onUpdate:modelValue":l[1]||(l[1]=o=>r.enIngredientName=o),type:"text",label:"영문성분명",class:"w-full mt-3",style:{width:"100%"}},null,8,["modelValue"]),n(c,{modelValue:r.cnIngredientName,"onUpdate:modelValue":l[2]||(l[2]=o=>r.cnIngredientName=o),type:"text",label:"중문성분명",class:"w-full mt-3",style:{width:"100%"}},null,8,["modelValue"]),n(c,{modelValue:r.casNo,"onUpdate:modelValue":l[3]||(l[3]=o=>r.casNo=o),type:"text",label:"CAS NO.",class:"w-full mt-3",style:{width:"100%"}},null,8,["modelValue"]),n(c,{modelValue:r.functionCd,"onUpdate:modelValue":l[4]||(l[4]=o=>r.functionCd=o),type:"select",label:"function",options:s.value,optionLabel:"codeNm",optionValue:"code",class:"w-full mt-3",style:{width:"100%"}},null,8,["modelValue","options"]),n(c,{modelValue:r.etc,"onUpdate:modelValue":l[5]||(l[5]=o=>r.etc=o),type:"textarea",label:"비고",class:"w-full mt-3",style:{width:"100%"}},null,8,["modelValue"])]),u("div",ze,[n(d,{legend:"한도국가"},{default:w(()=>[n(y,{modelValue:i.value,"onUpdate:modelValue":l[7]||(l[7]=o=>i.value=o),name:"한도국가",class:"flex flex-wrap gap-4"},{default:w(()=>[(b(!0),h(O,null,F(p.value,o=>(b(),h("div",{key:o.code,class:"flex items-center gap-2"},[n(I,{inputId:`limit-${o.code}`,value:o.code,modelValue:i.value,"onUpdate:modelValue":l[6]||(l[6]=V=>i.value=V)},null,8,["inputId","value","modelValue"]),u("label",{for:`limit-${o.code}`},k(o.codeNm),9,Me)]))),128))]),_:1},8,["modelValue"])]),_:1}),n(d,{legend:"금지국가"},{default:w(()=>[n(y,{modelValue:v.value,"onUpdate:modelValue":l[9]||(l[9]=o=>v.value=o),name:"금지국가",class:"flex flex-wrap gap-4"},{default:w(()=>[(b(!0),h(O,null,F(p.value,o=>(b(),h("div",{key:o.code,class:"flex items-center gap-2"},[n(I,{inputId:`ban-${o.code}`,value:o.code,modelValue:v.value,"onUpdate:modelValue":l[8]||(l[8]=V=>v.value=V)},null,8,["inputId","value","modelValue"]),u("label",{for:`ban-${o.code}`},k(o.codeNm),9,Te)]))),128))]),_:1},8,["modelValue"])]),_:1})])]),u("div",Re,[n(P,{type:"button",label:"저장",severity:"secondary",class:"bg-primary-300",onClick:_}),n(P,{type:"button",label:"닫기",severity:"secondary",onClick:l[10]||(l[10]=o=>a("close-visible"))})])],64)}}},He={class:"flex items-center justify-end gap-2 mb-2"},qe={class:"flex flex-col mt-2"},Je=["onClick"],Qe={__name:"IngredientList",setup(e){ce();const{vError:t,vSuccess:a}=de(),s=m(!1),p=m([]),i=m([]),v=m({icon:"pi pi-home"}),r=m(""),$=m(""),_=async()=>{const y={...c};i.value=await B.getIngredientList(y)};M(async()=>{p.value=await j.getCodeList("fn_cd")});const x=y=>{a("저장되었습니다."),_()},l=y=>{console.log("cd",y),W(y)?(r.value="성분 신규",$.value=""):(r.value="성분 상세",$.value=y),s.value=!0},c=z({ingredientName:"",functionCd:"",regName:""}),I=m([{label:"연구관리"},{label:"성분관리조회"}]);return(y,d)=>{const P=we,o=R,V=T,J=he,Q=ye,C=ve,X=be,Y=pe;return b(),h(O,null,[n(P,{home:v.value,model:I.value},null,8,["home","model"]),u("form",{onSubmit:ue(_,["prevent"]),class:"space-y-4"},[n(Q,{class:"flex"},{default:w(()=>[n(J,{class:"flex mt-2 mb-2 gap-1 w-full"},{start:w(()=>[n(o,{modelValue:c.functionCd,"onUpdate:modelValue":d[0]||(d[0]=g=>c.functionCd=g),type:"select",label:"function",options:p.value,optionLabel:"codeNm",optionValue:"code",style:{width:"160px"}},null,8,["modelValue","options"]),n(o,{modelValue:c.ingredientName,"onUpdate:modelValue":d[1]||(d[1]=g=>c.ingredientName=g),type:"text",label:"성분명",style:{width:"200px"}},null,8,["modelValue"]),n(o,{modelValue:c.regName,"onUpdate:modelValue":d[2]||(d[2]=g=>c.regName=g),type:"text",label:"등록자",style:{width:"160px"}},null,8,["modelValue"]),n(V,{label:"검색",icon:"pi pi-search",severity:"secondary",type:"submit"})]),_:1})]),_:1})],32),u("div",He,[n(V,{label:"신규",icon:"pi pi-plus",severity:"secondary",onClick:d[3]||(d[3]=g=>l(""))}),n(V,{label:"엑셀",icon:"pi pi-file-excel",severity:"success"})]),u("div",qe,[n(X,{value:i.value,paginator:"",rows:20,rowsPerPageOptions:[20,30,40],tableStyle:"table-layout: fixed; width: 100%",columnResizeMode:"fit",class:"my-table",scrollHeight:"650px",showGridlines:""},{default:w(()=>[n(C,{field:"ingredientCode",header:"성분코드",style:{width:"100px"}},{body:w(g=>[u("div",{onClick:Xe=>l(g.data.ingredientCode),class:"clickable-cell",style:{cursor:"pointer","text-decoration":"underline"}},k(g.data.ingredientCode),9,Je)]),_:1}),n(C,{field:"krIngredientName",header:"국문성분명",style:S([{width:"200px"},{"text-align":"left"}]),bodyClass:"break-words"}),n(C,{field:"enIngredientName",header:"영문성분명",style:S([{width:"200px"},{"text-align":"left"}]),bodyClass:"break-words"}),n(C,{field:"cnIngredientName",header:"중문성분명",style:S([{width:"200px"},{"text-align":"left"}]),bodyClass:"break-words"}),n(C,{field:"casNo",header:"CAS NO.",style:{width:"100px"}}),n(C,{field:"functionNm",header:"function",style:S([{width:"180px"},{"text-align":"left"}])}),n(C,{field:"regName",header:"등록자",style:{width:"80px"}}),n(C,{field:"updName",header:"수정자",style:{width:"80px"}}),n(C,{field:"etc",header:"비고",style:{width:"120px"}})]),_:1},8,["value"])]),n(Y,{visible:s.value,"onUpdate:visible":d[5]||(d[5]=g=>s.value=g),modal:"",header:"성분정보",draggable:!1,resizable:!1,style:{width:"65rem",height:"44rem"}},{default:w(()=>[n(We,{id:$.value,onSaved:x,onCloseVisible:d[4]||(d[4]=g=>s.value=!1)},null,8,["id"])]),_:1},8,["visible"])],64)}}},gt=re(Qe,[["__scopeId","data-v-32f1ee0c"]]);export{gt as default};
