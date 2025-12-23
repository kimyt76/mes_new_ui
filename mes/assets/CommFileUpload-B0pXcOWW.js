import{ae as ie,e as p,o as i,h as b,m as l,B as H,af as q,R as Q,a as j,f as _,k as L,r as le,i as h,l as B,g as v,q as w,w as re,n as S,j as U,T as de,y as $,t as z,ag as ue,G as E,ah as G,ai as ce,u as W,p as C,F as R,aj as Z,ak as pe,K as fe,A as me,a8 as ge,a2 as I,al as he}from"./index-BCdxernO.js";import{d as be,s as V,a as ye}from"./index-Z2YNGKhZ.js";var ee={name:"UploadIcon",extends:ie};function ve(e){return ke(e)||Ce(e)||Be(e)||we()}function we(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Be(e,n){if(e){if(typeof e=="string")return K(e,n);var t={}.toString.call(e).slice(8,-1);return t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set"?Array.from(e):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?K(e,n):void 0}}function Ce(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function ke(e){if(Array.isArray(e))return K(e)}function K(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,a=Array(n);t<n;t++)a[t]=e[t];return a}function Fe(e,n,t,a,o,s){return i(),p("svg",l({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.pti()),ve(n[0]||(n[0]=[b("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M6.58942 9.82197C6.70165 9.93405 6.85328 9.99793 7.012 10C7.17071 9.99793 7.32234 9.93405 7.43458 9.82197C7.54681 9.7099 7.61079 9.55849 7.61286 9.4V2.04798L9.79204 4.22402C9.84752 4.28011 9.91365 4.32457 9.98657 4.35479C10.0595 4.38502 10.1377 4.40039 10.2167 4.40002C10.2956 4.40039 10.3738 4.38502 10.4467 4.35479C10.5197 4.32457 10.5858 4.28011 10.6413 4.22402C10.7538 4.11152 10.817 3.95902 10.817 3.80002C10.817 3.64102 10.7538 3.48852 10.6413 3.37602L7.45127 0.190618C7.44656 0.185584 7.44176 0.180622 7.43687 0.175736C7.32419 0.063214 7.17136 0 7.012 0C6.85264 0 6.69981 0.063214 6.58712 0.175736C6.58181 0.181045 6.5766 0.186443 6.5715 0.191927L3.38282 3.37602C3.27669 3.48976 3.2189 3.6402 3.22165 3.79564C3.2244 3.95108 3.28746 4.09939 3.39755 4.20932C3.50764 4.31925 3.65616 4.38222 3.81182 4.38496C3.96749 4.3877 4.11814 4.33001 4.23204 4.22402L6.41113 2.04807V9.4C6.41321 9.55849 6.47718 9.7099 6.58942 9.82197ZM11.9952 14H2.02883C1.751 13.9887 1.47813 13.9228 1.22584 13.8061C0.973545 13.6894 0.746779 13.5241 0.558517 13.3197C0.370254 13.1154 0.22419 12.876 0.128681 12.6152C0.0331723 12.3545 -0.00990605 12.0775 0.0019109 11.8V9.40005C0.0019109 9.24092 0.065216 9.08831 0.1779 8.97579C0.290584 8.86326 0.443416 8.80005 0.602775 8.80005C0.762134 8.80005 0.914966 8.86326 1.02765 8.97579C1.14033 9.08831 1.20364 9.24092 1.20364 9.40005V11.8C1.18295 12.0376 1.25463 12.274 1.40379 12.4602C1.55296 12.6463 1.76817 12.7681 2.00479 12.8H11.9952C12.2318 12.7681 12.447 12.6463 12.5962 12.4602C12.7453 12.274 12.817 12.0376 12.7963 11.8V9.40005C12.7963 9.24092 12.8596 9.08831 12.9723 8.97579C13.085 8.86326 13.2378 8.80005 13.3972 8.80005C13.5565 8.80005 13.7094 8.86326 13.8221 8.97579C13.9347 9.08831 13.998 9.24092 13.998 9.40005V11.8C14.022 12.3563 13.8251 12.8996 13.45 13.3116C13.0749 13.7236 12.552 13.971 11.9952 14Z",fill:"currentColor"},null,-1)])),16)}ee.render=Fe;var Se=`
    .p-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content-wrapper {
        min-height: 0;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }

    .p-message-enter-active {
        animation: p-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .p-message-leave-active {
        animation: p-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes p-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`,Ie={root:function(n){var t=n.props;return["p-message p-component p-message-"+t.severity,{"p-message-outlined":t.variant==="outlined","p-message-simple":t.variant==="simple","p-message-sm":t.size==="small","p-message-lg":t.size==="large"}]},contentWrapper:"p-message-content-wrapper",content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},Le=H.extend({name:"message",style:Se,classes:Ie}),ze={name:"BaseMessage",extends:j,props:{severity:{type:String,default:"info"},closable:{type:Boolean,default:!1},life:{type:Number,default:null},icon:{type:String,default:void 0},closeIcon:{type:String,default:void 0},closeButtonProps:{type:null,default:null},size:{type:String,default:null},variant:{type:String,default:null}},style:Le,provide:function(){return{$pcMessage:this,$parentInstance:this}}};function T(e){"@babel/helpers - typeof";return T=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},T(e)}function Y(e,n,t){return(n=Pe(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function Pe(e){var n=Ue(e,"string");return T(n)=="symbol"?n:n+""}function Ue(e,n){if(T(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var a=t.call(e,n);if(T(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}var ne={name:"Message",extends:ze,inheritAttrs:!1,emits:["close","life-end"],timeout:null,data:function(){return{visible:!0}},mounted:function(){var n=this;this.life&&setTimeout(function(){n.visible=!1,n.$emit("life-end")},this.life)},methods:{close:function(n){this.visible=!1,this.$emit("close",n)}},computed:{closeAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.close:void 0},dataP:function(){return _(Y(Y({outlined:this.variant==="outlined",simple:this.variant==="simple"},this.severity,this.severity),this.size,this.size))}},directives:{ripple:Q},components:{TimesIcon:q}};function D(e){"@babel/helpers - typeof";return D=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},D(e)}function X(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),t.push.apply(t,a)}return t}function J(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?X(Object(t),!0).forEach(function(a){Me(e,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):X(Object(t)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})}return e}function Me(e,n,t){return(n=Ee(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function Ee(e){var n=Te(e,"string");return D(n)=="symbol"?n:n+""}function Te(e,n){if(D(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var a=t.call(e,n);if(D(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}var De=["data-p"],Ae=["data-p"],je=["data-p"],Oe=["aria-label","data-p"],Ve=["data-p"];function Ne(e,n,t,a,o,s){var d=L("TimesIcon"),r=le("ripple");return i(),h(de,l({name:"p-message",appear:""},e.ptmi("transition")),{default:B(function(){return[o.visible?(i(),p("div",l({key:0,class:e.cx("root"),role:"alert","aria-live":"assertive","aria-atomic":"true","data-p":s.dataP},e.ptm("root")),[b("div",l({class:e.cx("contentWrapper")},e.ptm("contentWrapper")),[e.$slots.container?w(e.$slots,"container",{key:0,closeCallback:s.close}):(i(),p("div",l({key:1,class:e.cx("content"),"data-p":s.dataP},e.ptm("content")),[w(e.$slots,"icon",{class:S(e.cx("icon"))},function(){return[(i(),h(U(e.icon?"span":null),l({class:[e.cx("icon"),e.icon],"data-p":s.dataP},e.ptm("icon")),null,16,["class","data-p"]))]}),e.$slots.default?(i(),p("div",l({key:0,class:e.cx("text"),"data-p":s.dataP},e.ptm("text")),[w(e.$slots,"default")],16,je)):v("",!0),e.closable?re((i(),p("button",l({key:1,class:e.cx("closeButton"),"aria-label":s.closeAriaLabel,type:"button",onClick:n[0]||(n[0]=function(y){return s.close(y)}),"data-p":s.dataP},J(J({},e.closeButtonProps),e.ptm("closeButton"))),[w(e.$slots,"closeicon",{},function(){return[e.closeIcon?(i(),p("i",l({key:0,class:[e.cx("closeIcon"),e.closeIcon],"data-p":s.dataP},e.ptm("closeIcon")),null,16,Ve)):(i(),h(d,l({key:1,class:[e.cx("closeIcon"),e.closeIcon],"data-p":s.dataP},e.ptm("closeIcon")),null,16,["class","data-p"]))]})],16,Oe)),[[r]]):v("",!0)],16,Ae))],16)],16,De)):v("",!0)]}),_:3},16)}ne.render=Ne;var $e=`
    .p-progressbar {
        display: block;
        position: relative;
        overflow: hidden;
        height: dt('progressbar.height');
        background: dt('progressbar.background');
        border-radius: dt('progressbar.border.radius');
    }

    .p-progressbar-value {
        margin: 0;
        background: dt('progressbar.value.background');
    }

    .p-progressbar-label {
        color: dt('progressbar.label.color');
        font-size: dt('progressbar.label.font.size');
        font-weight: dt('progressbar.label.font.weight');
    }

    .p-progressbar-determinate .p-progressbar-value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: width 1s ease-in-out;
    }

    .p-progressbar-determinate .p-progressbar-label {
        display: inline-flex;
    }

    .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .p-progressbar-indeterminate .p-progressbar-value::after {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }

    @keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
`,We={root:function(n){var t=n.instance;return["p-progressbar p-component",{"p-progressbar-determinate":t.determinate,"p-progressbar-indeterminate":t.indeterminate}]},value:"p-progressbar-value",label:"p-progressbar-label"},Re=H.extend({name:"progressbar",style:$e,classes:We}),Ke={name:"BaseProgressBar",extends:j,props:{value:{type:Number,default:null},mode:{type:String,default:"determinate"},showValue:{type:Boolean,default:!0}},style:Re,provide:function(){return{$pcProgressBar:this,$parentInstance:this}}},te={name:"ProgressBar",extends:Ke,inheritAttrs:!1,computed:{progressStyle:function(){return{width:this.value+"%",display:"flex"}},indeterminate:function(){return this.mode==="indeterminate"},determinate:function(){return this.mode==="determinate"},dataP:function(){return _({determinate:this.determinate,indeterminate:this.indeterminate})}}},xe=["aria-valuenow","data-p"],He=["data-p"],qe=["data-p"],Ge=["data-p"];function Ze(e,n,t,a,o,s){return i(),p("div",l({role:"progressbar",class:e.cx("root"),"aria-valuemin":"0","aria-valuenow":e.value,"aria-valuemax":"100","data-p":s.dataP},e.ptmi("root")),[s.determinate?(i(),p("div",l({key:0,class:e.cx("value"),style:s.progressStyle,"data-p":s.dataP},e.ptm("value")),[e.value!=null&&e.value!==0&&e.showValue?(i(),p("div",l({key:0,class:e.cx("label"),"data-p":s.dataP},e.ptm("label")),[w(e.$slots,"default",{},function(){return[$(z(e.value+"%"),1)]})],16,qe)):v("",!0)],16,He)):s.indeterminate?(i(),p("div",l({key:1,class:e.cx("value"),"data-p":s.dataP},e.ptm("value")),null,16,Ge)):v("",!0)],16,xe)}te.render=Ze;var Ye=`
    .p-fileupload input[type='file'] {
        display: none;
    }

    .p-fileupload-advanced {
        border: 1px solid dt('fileupload.border.color');
        border-radius: dt('fileupload.border.radius');
        background: dt('fileupload.background');
        color: dt('fileupload.color');
    }

    .p-fileupload-header {
        display: flex;
        align-items: center;
        padding: dt('fileupload.header.padding');
        background: dt('fileupload.header.background');
        color: dt('fileupload.header.color');
        border-style: solid;
        border-width: dt('fileupload.header.border.width');
        border-color: dt('fileupload.header.border.color');
        border-radius: dt('fileupload.header.border.radius');
        gap: dt('fileupload.header.gap');
    }

    .p-fileupload-content {
        border: 1px solid transparent;
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.content.gap');
        transition: border-color dt('fileupload.transition.duration');
        padding: dt('fileupload.content.padding');
    }

    .p-fileupload-content .p-progressbar {
        width: 100%;
        height: dt('fileupload.progressbar.height');
    }

    .p-fileupload-file-list {
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.filelist.gap');
    }

    .p-fileupload-file {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: dt('fileupload.file.padding');
        border-block-end: 1px solid dt('fileupload.file.border.color');
        gap: dt('fileupload.file.gap');
    }

    .p-fileupload-file:last-child {
        border-block-end: 0;
    }

    .p-fileupload-file-info {
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.file.info.gap');
    }

    .p-fileupload-file-thumbnail {
        flex-shrink: 0;
    }

    .p-fileupload-file-actions {
        margin-inline-start: auto;
    }

    .p-fileupload-highlight {
        border: 1px dashed dt('fileupload.content.highlight.border.color');
    }

    .p-fileupload-basic .p-message {
        margin-block-end: dt('fileupload.basic.gap');
    }

    .p-fileupload-basic-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: dt('fileupload.basic.gap');
    }
`,Xe={root:function(n){var t=n.props;return["p-fileupload p-fileupload-".concat(t.mode," p-component")]},header:"p-fileupload-header",pcChooseButton:"p-fileupload-choose-button",pcUploadButton:"p-fileupload-upload-button",pcCancelButton:"p-fileupload-cancel-button",content:"p-fileupload-content",fileList:"p-fileupload-file-list",file:"p-fileupload-file",fileThumbnail:"p-fileupload-file-thumbnail",fileInfo:"p-fileupload-file-info",fileName:"p-fileupload-file-name",fileSize:"p-fileupload-file-size",pcFileBadge:"p-fileupload-file-badge",fileActions:"p-fileupload-file-actions",pcFileRemoveButton:"p-fileupload-file-remove-button",basicContent:"p-fileupload-basic-content"},Je=H.extend({name:"fileupload",style:Ye,classes:Xe}),Qe={name:"BaseFileUpload",extends:j,props:{name:{type:String,default:null},url:{type:String,default:null},mode:{type:String,default:"advanced"},multiple:{type:Boolean,default:!1},accept:{type:String,default:null},disabled:{type:Boolean,default:!1},auto:{type:Boolean,default:!1},maxFileSize:{type:Number,default:null},invalidFileSizeMessage:{type:String,default:"{0}: Invalid file size, file size should be smaller than {1}."},invalidFileTypeMessage:{type:String,default:"{0}: Invalid file type, allowed file types: {1}."},fileLimit:{type:Number,default:null},invalidFileLimitMessage:{type:String,default:"Maximum number of files exceeded, limit is {0} at most."},withCredentials:{type:Boolean,default:!1},previewWidth:{type:Number,default:50},chooseLabel:{type:String,default:null},uploadLabel:{type:String,default:null},cancelLabel:{type:String,default:null},customUpload:{type:Boolean,default:!1},showUploadButton:{type:Boolean,default:!0},showCancelButton:{type:Boolean,default:!0},chooseIcon:{type:String,default:void 0},uploadIcon:{type:String,default:void 0},cancelIcon:{type:String,default:void 0},style:null,class:null,chooseButtonProps:{type:null,default:null},uploadButtonProps:{type:Object,default:function(){return{severity:"secondary"}}},cancelButtonProps:{type:Object,default:function(){return{severity:"secondary"}}}},style:Je,provide:function(){return{$pcFileUpload:this,$parentInstance:this}}},se={name:"FileContent",hostName:"FileUpload",extends:j,emits:["remove"],props:{files:{type:Array,default:function(){return[]}},badgeSeverity:{type:String,default:"warn"},badgeValue:{type:String,default:null},previewWidth:{type:Number,default:50},templates:{type:null,default:null}},methods:{formatSize:function(n){var t,a=1024,o=3,s=((t=this.$primevue.config.locale)===null||t===void 0?void 0:t.fileSizeTypes)||["B","KB","MB","GB","TB","PB","EB","ZB","YB"];if(n===0)return"0 ".concat(s[0]);var d=Math.floor(Math.log(n)/Math.log(a)),r=parseFloat((n/Math.pow(a,d)).toFixed(o));return"".concat(r," ").concat(s[d])}},components:{Button:E,Badge:ue,TimesIcon:q}},_e=["alt","src","width"];function en(e,n,t,a,o,s){var d=L("Badge"),r=L("TimesIcon"),y=L("Button");return i(!0),p(R,null,W(t.files,function(m,g){return i(),p("div",l({key:m.name+m.type+m.size,class:e.cx("file")},{ref_for:!0},e.ptm("file")),[b("img",l({role:"presentation",class:e.cx("fileThumbnail"),alt:m.name,src:m.objectURL,width:t.previewWidth},{ref_for:!0},e.ptm("fileThumbnail")),null,16,_e),b("div",l({class:e.cx("fileInfo")},{ref_for:!0},e.ptm("fileInfo")),[b("div",l({class:e.cx("fileName")},{ref_for:!0},e.ptm("fileName")),z(m.name),17),b("span",l({class:e.cx("fileSize")},{ref_for:!0},e.ptm("fileSize")),z(s.formatSize(m.size)),17)],16),C(d,{value:t.badgeValue,class:S(e.cx("pcFileBadge")),severity:t.badgeSeverity,unstyled:e.unstyled,pt:e.ptm("pcFileBadge")},null,8,["value","class","severity","unstyled","pt"]),b("div",l({class:e.cx("fileActions")},{ref_for:!0},e.ptm("fileActions")),[C(y,{onClick:function(c){return e.$emit("remove",g)},text:"",rounded:"",severity:"danger",class:S(e.cx("pcFileRemoveButton")),unstyled:e.unstyled,pt:e.ptm("pcFileRemoveButton")},{icon:B(function(u){return[t.templates.fileremoveicon?(i(),h(U(t.templates.fileremoveicon),{key:0,class:S(u.class),file:m,index:g},null,8,["class","file","index"])):(i(),h(r,l({key:1,class:u.class,"aria-hidden":"true"},{ref_for:!0},e.ptm("pcFileRemoveButton").icon),null,16,["class"]))]}),_:2},1032,["onClick","class","unstyled","pt"])],16)],16)}),128)}se.render=en;function N(e){return sn(e)||tn(e)||ae(e)||nn()}function nn(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function tn(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function sn(e){if(Array.isArray(e))return x(e)}function A(e,n){var t=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=ae(e))||n){t&&(e=t);var a=0,o=function(){};return{s:o,n:function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}},e:function(m){throw m},f:o}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var s,d=!0,r=!1;return{s:function(){t=t.call(e)},n:function(){var m=t.next();return d=m.done,m},e:function(m){r=!0,s=m},f:function(){try{d||t.return==null||t.return()}finally{if(r)throw s}}}}function ae(e,n){if(e){if(typeof e=="string")return x(e,n);var t={}.toString.call(e).slice(8,-1);return t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set"?Array.from(e):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?x(e,n):void 0}}function x(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,a=Array(n);t<n;t++)a[t]=e[t];return a}var oe={name:"FileUpload",extends:Qe,inheritAttrs:!1,emits:["select","uploader","before-upload","progress","upload","error","before-send","clear","remove","remove-uploaded-file"],duplicateIEEvent:!1,data:function(){return{uploadedFileCount:0,files:[],messages:[],focused:!1,progress:null,uploadedFiles:[]}},methods:{upload:function(){this.hasFiles&&this.uploader()},onBasicUploaderClick:function(n){n.button===0&&this.$refs.fileInput.click()},onFileSelect:function(n){if(n.type!=="drop"&&this.isIE11()&&this.duplicateIEEvent){this.duplicateIEEvent=!1;return}this.isBasic&&this.hasFiles&&(this.files=[]),this.messages=[],this.files=this.files||[];var t=n.dataTransfer?n.dataTransfer.files:n.target.files,a=A(t),o;try{for(a.s();!(o=a.n()).done;){var s=o.value;!this.isFileSelected(s)&&!this.isFileLimitExceeded()&&this.validate(s)&&(this.isImage(s)&&(s.objectURL=window.URL.createObjectURL(s)),this.files.push(s))}}catch(d){a.e(d)}finally{a.f()}this.$emit("select",{originalEvent:n,files:this.files}),this.fileLimit&&this.checkFileLimit(),this.auto&&this.hasFiles&&!this.isFileLimitExceeded()&&this.uploader(),n.type!=="drop"&&this.isIE11()?this.clearIEInput():this.clearInputElement()},choose:function(){this.$refs.fileInput.click()},uploader:function(){var n=this;if(this.customUpload)this.fileLimit&&(this.uploadedFileCount+=this.files.length),this.$emit("uploader",{files:this.files});else{var t=new XMLHttpRequest,a=new FormData;this.$emit("before-upload",{xhr:t,formData:a});var o=A(this.files),s;try{for(o.s();!(s=o.n()).done;){var d=s.value;a.append(this.name,d,d.name)}}catch(r){o.e(r)}finally{o.f()}t.upload.addEventListener("progress",function(r){r.lengthComputable&&(n.progress=Math.round(r.loaded*100/r.total)),n.$emit("progress",{originalEvent:r,progress:n.progress})}),t.onreadystatechange=function(){if(t.readyState===4){if(n.progress=0,t.status>=200&&t.status<300){var r;n.fileLimit&&(n.uploadedFileCount+=n.files.length),n.$emit("upload",{xhr:t,files:n.files}),(r=n.uploadedFiles).push.apply(r,N(n.files))}else n.$emit("error",{xhr:t,files:n.files});n.clear()}},this.url&&(t.open("POST",this.url,!0),this.$emit("before-send",{xhr:t,formData:a}),t.withCredentials=this.withCredentials,t.send(a))}},clear:function(){this.files=[],this.messages=null,this.$emit("clear"),this.isAdvanced&&this.clearInputElement()},onFocus:function(){this.focused=!0},onBlur:function(){this.focused=!1},isFileSelected:function(n){if(this.files&&this.files.length){var t=A(this.files),a;try{for(t.s();!(a=t.n()).done;){var o=a.value;if(o.name+o.type+o.size===n.name+n.type+n.size)return!0}}catch(s){t.e(s)}finally{t.f()}}return!1},isIE11:function(){return!!window.MSInputMethodContext&&!!document.documentMode},validate:function(n){return this.accept&&!this.isFileTypeValid(n)?(this.messages.push(this.invalidFileTypeMessage.replace("{0}",n.name).replace("{1}",this.accept)),!1):this.maxFileSize&&n.size>this.maxFileSize?(this.messages.push(this.invalidFileSizeMessage.replace("{0}",n.name).replace("{1}",this.formatSize(this.maxFileSize))),!1):!0},isFileTypeValid:function(n){var t=this.accept.split(",").map(function(r){return r.trim()}),a=A(t),o;try{for(a.s();!(o=a.n()).done;){var s=o.value,d=this.isWildcard(s)?this.getTypeClass(n.type)===this.getTypeClass(s):n.type==s||this.getFileExtension(n).toLowerCase()===s.toLowerCase();if(d)return!0}}catch(r){a.e(r)}finally{a.f()}return!1},getTypeClass:function(n){return n.substring(0,n.indexOf("/"))},isWildcard:function(n){return n.indexOf("*")!==-1},getFileExtension:function(n){return"."+n.name.split(".").pop()},isImage:function(n){return/^image\//.test(n.type)},onDragEnter:function(n){!this.disabled&&(!this.hasFiles||this.multiple)&&(n.stopPropagation(),n.preventDefault())},onDragOver:function(n){!this.disabled&&(!this.hasFiles||this.multiple)&&(!this.isUnstyled&&ce(this.$refs.content,"p-fileupload-highlight"),this.$refs.content.setAttribute("data-p-highlight",!0),n.stopPropagation(),n.preventDefault())},onDragLeave:function(){this.disabled||(!this.isUnstyled&&G(this.$refs.content,"p-fileupload-highlight"),this.$refs.content.setAttribute("data-p-highlight",!1))},onDrop:function(n){if(!this.disabled){!this.isUnstyled&&G(this.$refs.content,"p-fileupload-highlight"),this.$refs.content.setAttribute("data-p-highlight",!1),n.stopPropagation(),n.preventDefault();var t=n.dataTransfer?n.dataTransfer.files:n.target.files,a=this.multiple||t&&t.length===1;a&&this.onFileSelect(n)}},remove:function(n){this.clearInputElement();var t=this.files.splice(n,1)[0];this.files=N(this.files),this.$emit("remove",{file:t,files:this.files})},removeUploadedFile:function(n){var t=this.uploadedFiles.splice(n,1)[0];this.uploadedFiles=N(this.uploadedFiles),this.$emit("remove-uploaded-file",{file:t,files:this.uploadedFiles})},clearInputElement:function(){this.$refs.fileInput.value=""},clearIEInput:function(){this.$refs.fileInput&&(this.duplicateIEEvent=!0,this.$refs.fileInput.value="")},formatSize:function(n){var t,a=1024,o=3,s=((t=this.$primevue.config.locale)===null||t===void 0?void 0:t.fileSizeTypes)||["B","KB","MB","GB","TB","PB","EB","ZB","YB"];if(n===0)return"0 ".concat(s[0]);var d=Math.floor(Math.log(n)/Math.log(a)),r=parseFloat((n/Math.pow(a,d)).toFixed(o));return"".concat(r," ").concat(s[d])},isFileLimitExceeded:function(){return this.fileLimit&&this.fileLimit<=this.files.length+this.uploadedFileCount&&this.focused&&(this.focused=!1),this.fileLimit&&this.fileLimit<this.files.length+this.uploadedFileCount},checkFileLimit:function(){this.isFileLimitExceeded()&&this.messages.push(this.invalidFileLimitMessage.replace("{0}",this.fileLimit.toString()))},onMessageClose:function(){this.messages=null}},computed:{isAdvanced:function(){return this.mode==="advanced"},isBasic:function(){return this.mode==="basic"},chooseButtonClass:function(){return[this.cx("pcChooseButton"),this.class]},basicFileChosenLabel:function(){var n;if(this.auto)return this.chooseButtonLabel;if(this.hasFiles){var t;return this.files&&this.files.length===1?this.files[0].name:(t=this.$primevue.config.locale)===null||t===void 0||(t=t.fileChosenMessage)===null||t===void 0?void 0:t.replace("{0}",this.files.length)}return((n=this.$primevue.config.locale)===null||n===void 0?void 0:n.noFileChosenMessage)||""},hasFiles:function(){return this.files&&this.files.length>0},hasUploadedFiles:function(){return this.uploadedFiles&&this.uploadedFiles.length>0},chooseDisabled:function(){return this.disabled||this.fileLimit&&this.fileLimit<=this.files.length+this.uploadedFileCount},uploadDisabled:function(){return this.disabled||!this.hasFiles||this.fileLimit&&this.fileLimit<this.files.length},cancelDisabled:function(){return this.disabled||!this.hasFiles},chooseButtonLabel:function(){return this.chooseLabel||this.$primevue.config.locale.choose},uploadButtonLabel:function(){return this.uploadLabel||this.$primevue.config.locale.upload},cancelButtonLabel:function(){return this.cancelLabel||this.$primevue.config.locale.cancel},completedLabel:function(){return this.$primevue.config.locale.completed},pendingLabel:function(){return this.$primevue.config.locale.pending}},components:{Button:E,ProgressBar:te,Message:ne,FileContent:se,PlusIcon:be,UploadIcon:ee,TimesIcon:q},directives:{ripple:Q}},an=["multiple","accept","disabled"],on=["accept","disabled","multiple"];function ln(e,n,t,a,o,s){var d=L("Button"),r=L("ProgressBar"),y=L("Message"),m=L("FileContent");return s.isAdvanced?(i(),p("div",l({key:0,class:e.cx("root")},e.ptmi("root")),[b("input",l({ref:"fileInput",type:"file",onChange:n[0]||(n[0]=function(){return s.onFileSelect&&s.onFileSelect.apply(s,arguments)}),multiple:e.multiple,accept:e.accept,disabled:s.chooseDisabled},e.ptm("input")),null,16,an),b("div",l({class:e.cx("header")},e.ptm("header")),[w(e.$slots,"header",{files:o.files,uploadedFiles:o.uploadedFiles,chooseCallback:s.choose,uploadCallback:s.uploader,clearCallback:s.clear},function(){return[C(d,l({label:s.chooseButtonLabel,class:s.chooseButtonClass,style:e.style,disabled:e.disabled,unstyled:e.unstyled,onClick:s.choose,onKeydown:Z(s.choose,["enter"]),onFocus:s.onFocus,onBlur:s.onBlur},e.chooseButtonProps,{pt:e.ptm("pcChooseButton")}),{icon:B(function(g){return[w(e.$slots,"chooseicon",{},function(){return[(i(),h(U(e.chooseIcon?"span":"PlusIcon"),l({class:[g.class,e.chooseIcon],"aria-hidden":"true"},e.ptm("pcChooseButton").icon),null,16,["class"]))]})]}),_:3},16,["label","class","style","disabled","unstyled","onClick","onKeydown","onFocus","onBlur","pt"]),e.showUploadButton?(i(),h(d,l({key:0,class:e.cx("pcUploadButton"),label:s.uploadButtonLabel,onClick:s.uploader,disabled:s.uploadDisabled,unstyled:e.unstyled},e.uploadButtonProps,{pt:e.ptm("pcUploadButton")}),{icon:B(function(g){return[w(e.$slots,"uploadicon",{},function(){return[(i(),h(U(e.uploadIcon?"span":"UploadIcon"),l({class:[g.class,e.uploadIcon],"aria-hidden":"true"},e.ptm("pcUploadButton").icon,{"data-pc-section":"uploadbuttonicon"}),null,16,["class"]))]})]}),_:3},16,["class","label","onClick","disabled","unstyled","pt"])):v("",!0),e.showCancelButton?(i(),h(d,l({key:1,class:e.cx("pcCancelButton"),label:s.cancelButtonLabel,onClick:s.clear,disabled:s.cancelDisabled,unstyled:e.unstyled},e.cancelButtonProps,{pt:e.ptm("pcCancelButton")}),{icon:B(function(g){return[w(e.$slots,"cancelicon",{},function(){return[(i(),h(U(e.cancelIcon?"span":"TimesIcon"),l({class:[g.class,e.cancelIcon],"aria-hidden":"true"},e.ptm("pcCancelButton").icon,{"data-pc-section":"cancelbuttonicon"}),null,16,["class"]))]})]}),_:3},16,["class","label","onClick","disabled","unstyled","pt"])):v("",!0)]})],16),b("div",l({ref:"content",class:e.cx("content"),onDragenter:n[1]||(n[1]=function(){return s.onDragEnter&&s.onDragEnter.apply(s,arguments)}),onDragover:n[2]||(n[2]=function(){return s.onDragOver&&s.onDragOver.apply(s,arguments)}),onDragleave:n[3]||(n[3]=function(){return s.onDragLeave&&s.onDragLeave.apply(s,arguments)}),onDrop:n[4]||(n[4]=function(){return s.onDrop&&s.onDrop.apply(s,arguments)})},e.ptm("content"),{"data-p-highlight":!1}),[w(e.$slots,"content",{files:o.files,uploadedFiles:o.uploadedFiles,removeUploadedFileCallback:s.removeUploadedFile,removeFileCallback:s.remove,progress:o.progress,messages:o.messages},function(){return[s.hasFiles?(i(),h(r,{key:0,value:o.progress,showValue:!1,unstyled:e.unstyled,pt:e.ptm("pcProgressbar")},null,8,["value","unstyled","pt"])):v("",!0),(i(!0),p(R,null,W(o.messages,function(g){return i(),h(y,{key:g,severity:"error",onClose:s.onMessageClose,unstyled:e.unstyled,pt:e.ptm("pcMessage")},{default:B(function(){return[$(z(g),1)]}),_:2},1032,["onClose","unstyled","pt"])}),128)),s.hasFiles?(i(),p("div",{key:1,class:S(e.cx("fileList"))},[C(m,{files:o.files,onRemove:s.remove,badgeValue:s.pendingLabel,previewWidth:e.previewWidth,templates:e.$slots,unstyled:e.unstyled,pt:e.pt},null,8,["files","onRemove","badgeValue","previewWidth","templates","unstyled","pt"])],2)):v("",!0),s.hasUploadedFiles?(i(),p("div",{key:2,class:S(e.cx("fileList"))},[C(m,{files:o.uploadedFiles,onRemove:s.removeUploadedFile,badgeValue:s.completedLabel,badgeSeverity:"success",previewWidth:e.previewWidth,templates:e.$slots,unstyled:e.unstyled,pt:e.pt},null,8,["files","onRemove","badgeValue","previewWidth","templates","unstyled","pt"])],2)):v("",!0)]}),e.$slots.empty&&!s.hasFiles&&!s.hasUploadedFiles?(i(),p("div",pe(l({key:0},e.ptm("empty"))),[w(e.$slots,"empty")],16)):v("",!0)],16)],16)):s.isBasic?(i(),p("div",l({key:1,class:e.cx("root")},e.ptmi("root")),[(i(!0),p(R,null,W(o.messages,function(g){return i(),h(y,{key:g,severity:"error",onClose:s.onMessageClose,unstyled:e.unstyled,pt:e.ptm("pcMessage")},{default:B(function(){return[$(z(g),1)]}),_:2},1032,["onClose","unstyled","pt"])}),128)),b("div",l({class:e.cx("basicContent")},e.ptm("basicContent")),[C(d,l({label:s.chooseButtonLabel,class:s.chooseButtonClass,style:e.style,disabled:e.disabled,unstyled:e.unstyled,onMouseup:s.onBasicUploaderClick,onKeydown:Z(s.choose,["enter"]),onFocus:s.onFocus,onBlur:s.onBlur},e.chooseButtonProps,{pt:e.ptm("pcChooseButton")}),{icon:B(function(g){return[w(e.$slots,"chooseicon",{},function(){return[(i(),h(U(e.chooseIcon?"span":"PlusIcon"),l({class:[g.class,e.chooseIcon],"aria-hidden":"true"},e.ptm("pcChooseButton").icon),null,16,["class"]))]})]}),_:3},16,["label","class","style","disabled","unstyled","onMouseup","onKeydown","onFocus","onBlur","pt"]),e.auto?v("",!0):w(e.$slots,"filelabel",{key:0,class:S(e.cx("filelabel")),files:o.files},function(){return[b("span",{class:S(e.cx("filelabel"))},z(s.basicFileChosenLabel),3)]}),b("input",l({ref:"fileInput",type:"file",accept:e.accept,disabled:e.disabled,multiple:e.multiple,onChange:n[5]||(n[5]=function(){return s.onFileSelect&&s.onFileSelect.apply(s,arguments)}),onFocus:n[6]||(n[6]=function(){return s.onFocus&&s.onFocus.apply(s,arguments)}),onBlur:n[7]||(n[7]=function(){return s.onBlur&&s.onBlur.apply(s,arguments)})},e.ptm("input")),null,16,on)],16)],16)):v("",!0)}oe.render=ln;const rn={class:"comm-file-upload justify-start"},dn={class:"flex align-items-center gap-2"},un={key:0,class:"text-xs text-primary"},cn={key:1,class:"text-xs text-red-500 line-through"},pn={key:0},fn={key:1},mn={class:"flex gap-2 justify-content-center"},gn={__name:"CommFileUpload",props:{modelValue:{type:Array,default:()=>[]},multiple:{type:Boolean,default:!0},accept:{type:String,default:""},maxFileSize:{type:Number,default:1024*1024*50},disabled:{type:Boolean,default:!1},downloadUrl:{type:String,default:""}},emits:["update:modelValue","error","downloaded"],setup(e,{emit:n}){const t=e,a=n,o=me(null),s=ge(()=>t.modelValue??[]),d=u=>{var M;const c=u.files||[],f=t.modelValue??[],P=[...f];c.forEach(k=>{f.some(F=>F.fileName===k.name&&F.fileSize===k.size&&F.flag!=="D")||P.push({fileName:k.name,fileSize:k.size,flag:"N",file:k})}),a("update:modelValue",P),(M=o.value)==null||M.clear()},r=u=>{const c=[...t.modelValue??[]],f=c.indexOf(u);f!==-1&&(u.flag==="S"?c[f]={...u,flag:"D"}:u.flag==="N"&&c.splice(f,1),a("update:modelValue",c))},y=u=>{if(!u&&u!==0)return"";const c=Math.floor(Math.log(u)/Math.log(1024));return(u/Math.pow(1024,c)).toFixed(2)*1+" "+["B","KB","MB","GB","TB"][c]},m=(u="")=>{const c=u.toLowerCase();return c.endsWith(".pdf")?"pi pi-file-pdf text-red-500":c.endsWith(".xlsx")||c.endsWith(".xls")?"pi pi-file-excel text-green-500":c.endsWith(".doc")||c.endsWith(".docx")?"pi pi-file-word text-blue-500":c.match(/\.(jpg|jpeg|png|gif)$/)?"pi pi-image text-primary":"pi pi-file"},g=async u=>{if(!t.downloadUrl){a("error","downloadUrl 이 설정되지 않았습니다.");return}try{const c=new URLSearchParams;u.attachFileId&&c.append("attachFileId",u.attachFileId),u.seq!==void 0&&c.append("seq",u.seq);const f=`${t.downloadUrl}?${c.toString()}`,P=await he.get(f,{responseType:"blob"}),M=new Blob([P.data],{type:P.headers["content-type"]}),k=window.URL.createObjectURL(M),O=u.fileName||"download";if(M.type==="application/pdf"||O.toLowerCase().endsWith(".pdf"))window.open(k,"_blank");else{const F=document.createElement("a");F.href=k,F.download=O,document.body.appendChild(F),F.click(),document.body.removeChild(F)}window.URL.revokeObjectURL(k),a("downloaded",u)}catch(c){console.error(c),a("error","파일 다운로드 중 오류가 발생했습니다.")}};return(u,c)=>(i(),p("div",rn,[C(I(oe),{ref_key:"uploader",ref:o,mode:"basic",chooseLabel:"파일선택",name:"files[]",multiple:e.multiple,accept:e.accept,maxFileSize:e.maxFileSize,showUploadButton:!1,showCancelButton:!1,customUpload:!0,disabled:e.disabled,showFileList:!1,onSelect:d},null,8,["multiple","accept","maxFileSize","disabled"]),C(I(ye),{value:s.value,class:"mt-3",showGridlines:!0,size:"small"},{default:B(()=>[C(I(V),{header:"파일명",field:"fileName"},{body:B(f=>[b("div",dn,[b("i",{class:S(m(f.data.fileName))},null,2),b("span",null,z(f.data.fileName),1),f.data.flag==="N"?(i(),p("span",un,"(신규)")):f.data.flag==="D"?(i(),p("span",cn,"(삭제 예정)")):v("",!0)])]),_:1}),C(I(V),{header:"크기",field:"fileSize",style:{width:"120px"}},{body:B(f=>[f.data.fileSize?(i(),p("span",pn,z(y(f.data.fileSize)),1)):(i(),p("span",fn,"-"))]),_:1}),C(I(V),{header:"기능",style:{width:"180px"}},{body:B(f=>[b("div",mn,[f.data.flag!=="N"&&f.data.flag!=="D"?(i(),h(I(E),{key:0,label:"다운로드",icon:"pi pi-download",class:"p-button-text p-button-sm",onClick:P=>g(f.data)},null,8,["onClick"])):(i(),h(I(E),{key:1,label:"다운로드",icon:"pi pi-download",class:"p-button-text p-button-sm p-button-secondary",disabled:""})),e.disabled?v("",!0):(i(),h(I(E),{key:2,icon:"pi pi-trash",class:"p-button-text p-button-sm p-button-danger",onClick:P=>r(f.data)},null,8,["onClick"]))])]),_:1})]),_:1},8,["value"])]))}},yn=fe(gn,[["__scopeId","data-v-a4f3ecd6"]]);export{yn as C};
