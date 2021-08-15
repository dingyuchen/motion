var e,t,a,n,r,s,l,o,u,c,i,m,p,d,b,f,g,h=Object.defineProperty,v=Object.defineProperties,x=Object.getOwnPropertyDescriptors,N=Object.getOwnPropertySymbols,y=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable,T=(e,t,a)=>t in e?h(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,w=(e,t)=>{for(var a in t||(t={}))y.call(t,a)&&T(e,a,t[a]);if(N)for(var a of N(t))S.call(t,a)&&T(e,a,t[a]);return e},C=(e,t)=>v(e,x(t));import{v as I,d as E,l as k,F as O,y as L,D as A,S as M}from"./vendor.cec4665d.js";(t=e||(e={})).And="And",t.Or="Or",t.Not="Not",(n=a||(a={})).IsBefore="IsBefore",n.IsAfter="IsAfter",n.IsBetween="IsBetween",(s=r||(r={})).MoreThan="MoreThan",s.LessThan="LessThan",s.MoreThanOrEqual="MoreThanOrEqual",s.LessThanOrEqual="LessThanOrEqual",s.Equal="Equal",(o=l||(l={})).Is="Is",o.IsNot="IsNot",(c=u||(u={})).IsChecked="IsChecked",c.IsNotChecked="IsNotChecked",(m=i||(i={})).AllOf="AllOf",m.NoneOf="NoneOf",m.AnyOf="AnyOf",m.NumberOf="NumberOf",m.Size="Size",(d=p||(p={})).Exists="Exists",d.ExistsAnd="ExistsAnd",(b||(b={})).Lookup="Lookup",(g=f||(f={}))[g.Date=0]="Date",g[g.Number=1]="Number",g[g.Enum=2]="Enum",g[g.Boolean=3]="Boolean",g[g.Collection=4]="Collection",g[g.Optional=5]="Optional",g[g.Model=6]="Model";const H=[0,1,2,3,4,5];function B(e,t){return e.getSchemata.find((e=>e.name===t))}function q(e){return{label:e.name,attributes:e.attributes.map((e=>P(e))),type:f.Model}}const P=e=>{switch(e.type){case f.Boolean:return C(w({},e),{value:!0});case f.Number:return C(w({},e),{value:0});case f.Collection:return C(w({},e),{value:[]});case f.Enum:{const t=e,{enumSet:a}=t,n=((e,t)=>{var a={};for(var n in e)y.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&N)for(var n of N(e))t.indexOf(n)<0&&S.call(e,n)&&(a[n]=e[n]);return a})(t,["enumSet"]);return C(w({},n),{value:e.enumSet[0]})}default:return C(w({},e),{value:void 0})}},U={name:"Gathering",attributes:[{label:"Group",type:f.Collection,subtype:"Person"},{label:"All persons are from the same household",type:f.Boolean}]};f.Number,f.Boolean;const R={args:[{args:["Is fully vaccinated"],op:b.Lookup}],op:u.IsChecked},j={args:[{args:["Group"],op:b.Lookup},R],op:i.AllOf},D={title:"Dine In (12 Aug 2021 onwards) - TESTING (incomplete)",rules:[{expr:{args:[{args:[{args:[{args:["Group"],op:b.Lookup}],op:i.Size},5],op:r.LessThanOrEqual},j],op:e.And},input:U}]},z={name:"MICE event pilots",attributes:[{label:"Participants are all fully vaccinated",type:f.Boolean},{label:"Type of event",type:f.Enum,enumSet:["Participants are predominantly seated or standing in a fixed position during the session.","Participants are predominantly non-seated and moving about during the session."]},{label:"Number of participants",type:f.Number}]},J={title:"MICE event pilots",rules:[{expr:{args:[{args:[{args:[{args:["Participants are all fully vaccinated"],op:b.Lookup}],op:u.IsNotChecked},{args:[{args:["Number of participants"],op:b.Lookup},50],op:r.LessThanOrEqual}],op:e.And},{args:[{args:[{args:["Participants are all fully vaccinated"],op:b.Lookup}],op:u.IsChecked},{args:[{args:["Type of event"],op:b.Lookup},"Participants are predominantly seated or standing in a fixed position during the session."],op:l.Is},{args:[{args:["Number of participants"],op:b.Lookup},500],op:r.LessThanOrEqual}],op:e.And},{args:[{args:[{args:["Participants are all fully vaccinated"],op:b.Lookup}],op:u.IsChecked},{args:[{args:["Type of event"],op:b.Lookup},"Participants are predominantly non-seated and moving about during the session."],op:l.Is},{args:[{args:["Number of participants"],op:b.Lookup},250],op:r.LessThanOrEqual}],op:e.And}],op:e.Or},input:z}]};function G({model:e,schema:t,onChange:a,store:n}){const r=t=>{const n=[...e.attributes],r=e.attributes.findIndex((e=>e.label===t.currentTarget.name));n[r]=C(w({},n[r]),{value:t.currentTarget.value}),a(C(w({},e),{attributes:n}))},s=t=>{const n="true"===t.currentTarget.value,r=[...e.attributes],s=e.attributes.findIndex((e=>e.label===t.currentTarget.name));r[s]=C(w({},r[s]),{value:n}),a(C(w({},e),{attributes:r}))},l=t=>{const n=[...e.attributes],r=e.attributes.findIndex((e=>e.label===t.currentTarget.name));n[r]=C(w({},n[r]),{value:parseInt(t.currentTarget.value)}),a(C(w({},e),{attributes:n}))},o=t=>{const n=[...e.attributes],r=e.attributes.findIndex((e=>e.label===t.currentTarget.name));n[r]=C(w({},n[r]),{value:Date.parse(t.currentTarget.value)}),a(C(w({},e),{attributes:n}))},u=(e,t,n)=>{const r=t.attributes.slice(),s=t.attributes.findIndex((e=>e.label===n));r[s]=C(w({},r[s]),{value:e}),a(C(w({},t),{attributes:r}))},c=[];for(let i of e.attributes){if(i.type===f.Collection){const a=B(n,t.attributes.find((e=>e.label===i.label)).subtype),r=i.label;let s={value:i.value};c.push(I(V,C(w({},s),{onChange:t=>u(t,e,i.label),subSchema:a,collectionLabel:r})))}if(i.type===f.Boolean&&c.push(I("div",{className:"flex mt-2"},I("h2",{className:"text-lg inline w-1/4"},i.label),I("select",{className:"border-2 pl-2 text-sm font-semibold py-2",onChange:s,name:i.label,value:i.value.toString()},I("option",{value:"true"},"Yes"),I("option",{value:"false"},"No")))),i.type===f.Number&&"number"==typeof i.value&&c.push(I("div",{className:"flex mt-2"},I("h2",{className:"text-lg inline w-1/4"},i.label),I("input",{type:"number",className:"border-2 pl-2 text-sm font-semibold py-2",onChange:l,name:i.label,value:i.value}))),i.type===f.Enum&&"string"==typeof i.value){const e=t.attributes.find((e=>e.label===i.label)).enumSet.map((e=>I("option",{value:e},e)));c.push(I("div",{className:"flex mt-2"},I("h2",{className:"text-lg inline w-1/4"},i.label),I("select",{className:"border-2 pl-2 text-sm font-semibold py-2",value:i.value,onChange:r,name:i.label},e)))}i.type!==f.Date||"string"!=typeof i.value&&void 0!==i.value||c.push(I("div",{className:"flex mt-2"},I("h2",{className:"text-lg inline w-1/4"},i.label),I("input",{type:"date",className:"border-2 pl-2 text-sm font-semibold py-2",onChange:o,name:i.label,value:i.value})))}return I(E,null,I("div",{class:"w-11/12 min-w-max card border-2 p-4 ml-1"},I("h1",{class:"text-2xl border-gray-300 text-gray-900 text-left"},e.label),c))}const V=e=>{const t=e.subSchema,a=[],n=e.store,r=(e,t,a)=>{const n=t.value.slice();n[a]=e,t.onChange(n)},s=t=>{const a=e.value.slice();a.splice(t,1),e.onChange(a)};for(const[l,o]of e.value.entries())a.push(I("div",{className:"flex",key:l},I("div",{className:"text-lg w-24 flex flex-col justify-center items-center"},l+1,I("div",{className:"btn-neutral text-sm font-semibold py-2 px-2 mt-10",onClick:()=>s(l)},I("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},I("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:5,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})))),I("div",{className:"flex-1"},I(G,{model:o,onChange:t=>r(t,e,l),schema:t,store:n}))));return I("div",{className:"border-2 p-4 my-4 card"},I("div",{className:"mt-2"},I("h2",{className:"text-lg mb-2"},e.collectionLabel," (a group consisting of multiple ",e.subSchema.name,")"),a),I("div",{className:"addSubModel mt-6 w-max btn-primary",onClick:()=>{console.log("new submodel");const a=e.value.slice();a.push(q(t)),e.onChange(a)}},"Add new ",e.subSchema.name))},W={Lookup:(e,t)=>{if(void 0===t.attributes)throw new Error(`Input: ${JSON.stringify(t)} is not a model instance`);const a=t.attributes.filter((t=>t.label===e));if(0===a.length)throw new Error(`Label: ${e} of Model: ${t.label} does not exist`);if(a.length>1)throw new Error(`Label: ${e} of Model: ${t.label} does not exist`);return a[0].value},Equal:(e,t)=>e===t,Exists:(e,t)=>!!W[b.Lookup](e,t),ExistsAnd:(e,t)=>W[p.Exists](e,t),Is:(e,t)=>e===t,IsAfter:(e,t)=>e>t,IsBefore:(e,t)=>e<t,IsBetween:(e,t,a)=>t<e&&e<a,IsChecked:e=>!!e,IsNot:(e,t)=>e!==t,IsNotChecked:e=>!e,LessThan:(e,t)=>e<t,LessThanOrEqual:(e,t)=>e<=t,MoreThan:(e,t)=>e>t,MoreThanOrEqual:(e,t)=>e>=t,Not:e=>!e},$=e=>t=>{const a=F(e,t);if("boolean"==typeof a)return a;throw new Error("Not a valid Lambda expression")},F=(t,a)=>{if((e=>!("object"==typeof e))(t))return t;const{op:n,args:r}=t;switch(n){case p.ExistsAnd:return(()=>{const[e,t]=[...r];return!!W[p.Exists](e,a)&&F(t,a)})();case e.And:return r.map((e=>F(e,a))).every((e=>e));case e.Or:return!!r.map((e=>F(e,a))).find((e=>e));case i.AllOf:return(()=>{const[e,t]=[...r];return F(e,a).every($(t))})();case i.AnyOf:return(()=>{const[e,t]=[...r];return!!F(e,a).find($(t))})();case i.NoneOf:return(()=>{const[e,t]=[...r],n=F(e,a),s=$(t);return n.every((e=>!s(e)))})();case i.NumberOf:return(()=>{const[e,t]=[...r],n=F(e,a),s=$(t);return n.filter(s).length})();case i.Size:return(()=>{const[e]=[...r];return F(e,a).length})();default:const t=[...r.map((e=>F(e,a))),a];return W[n](...t)}};function Y({ruleset:e,handleBack:t,store:a}){const n=e.rules.map((e=>e.input)),r=Array.from(new Set(n)).map((e=>({model:q(e),schema:e}))),[s,l]=k(r),[o,u]=k([]),c=()=>{const t=e.rules,a=[];for(const e of t){const t=e.input,n=s.find((e=>e.model.label===t.name)).model;console.log(n),a.push(F(e.expr,n))}u(a)};return I(E,null,I("div",{className:"mt-16"},I("div",{className:"flex w-11/12"},I("button",{className:"btn-danger px-4 text-md flex",onClick:t},I("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 mr-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},I("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:4,d:"M11 17l-5-5m0 0l5-5m-5 5h12"})),"Back"),I("div",{className:"flex-1"}),I("button",{onClick:c,className:"submit btn-good"},"Evaluate"))),I("div",{className:"mt-4"},I("h1",{className:"mb-4"},"CONSUMER VIEW"),s.map(((e,t)=>I(G,{model:e.model,onChange:e=>((e,t)=>{const a=[...s];a[t]={model:e,schema:a[t].schema},l(a)})(e,t),schema:e.schema,store:a})))),I("div",{className:"mt-12 flex justify-center"},I("button",{onClick:c,className:"submit btn-good"},"Evaluate")),I("div",{className:"mt-12 flex justify-center"},o.length>0?o.every((e=>!0===e))?I("span",{className:"text-green-600 font-semibold"},"PERMITTED"):I("span",{className:"text-red-600 font-semibold"},"NOT PERMITTED"):I("span",null)))}var X,K;function Q(){const[e,t]=k(X.Select),a=O(He),[n,r]=k(a.getRuleSets[0]),s=()=>{t(X.Select)};return I("div",{className:"px-24"},((e,t)=>{switch(e){case X.Edit:return I(Y,{handleBack:s,store:a,ruleset:n});case X.Select:return I(E,null,I("h1",{class:"text-2xl font-semibold mt-16"},"Select a situation to get started"),I("div",{class:"w-11/12 mt-16 rounded border-2 bg-blue-50 border-blue-200 p-4 ml-1 flex flex-wrap"},a.getRuleSets.map((e=>I("div",{className:"w-64 flex card border-2 ml-8 mt-4 py-12 text-center text-xl cursor-pointer hover:bg-gray-200",onClick:()=>t(e)},e.title)))))}})(e,(e=>{r(e),t(X.Edit)})))}(K=X||(X={})).Edit="edit",K.Select="select";const Z=()=>({args:[],op:e.And}),_=()=>({expr:Z(),input:{name:"",attributes:[]}}),ee=(e,t,a)=>{const n=e.slice(0);return n[t]=a,n},te=({schema:e,updateHandler:t})=>{const[a,n]=k(e),{attributes:r}=a,s=e=>t=>{n((a=>{const{attributes:n}=a;return C(w({},a),{attributes:ee(n,e,t)})}))};return I("div",{className:"card my-12 px-12 py-8"},I("form",{onSubmit:e=>((e,a)=>{e.preventDefault(),t(a)})(e,a)},I("div",null,I("h1",{className:"text-2xl font-semibold"},"Schema builder"),I("div",{className:"mt-4"},I("input",{required:!0,type:"text",label:"Name",placeholder:"Name of schema",value:a.name,onInput:e=>{if(e instanceof InputEvent&&e.currentTarget instanceof HTMLInputElement){const t=e.currentTarget.value;n((e=>C(w({},e),{name:t})))}},className:"border-2 text-xl py-2 px-2"})),I("h2",{className:"text-lg mt-6 font-semibold"},"Attributes:"),r.map(((e,t)=>I(ae,{attribute:e,onChange:s(t),onDelete:()=>(e=>{n((t=>{const{attributes:a}=t;return C(w({},t),{attributes:a.splice(e,1)})}))})(t)}))),I("div",{className:"mt-2"},I("button",{onClick:()=>{const e=r.concat({label:"",type:f.Boolean});n((t=>C(w({},t),{attributes:e})))},className:"btn-primary mt-4"},"Add new attribute"))),I("div",{className:"mt-8 border-t-2 flex"},I("button",{type:"submit",className:"mt-6 btn-good flex content-center"},I("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 mr-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},I("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"})),"SAVE"),I("button",{onClick:()=>t(e),className:"btn-danger mt-6 ml-4"},"EXIT WITHOUT SAVING"))))},ae=({attribute:e,onChange:t,onDelete:a})=>{const{label:n,type:r,enumSet:s,subtype:l}=e;return I("div",{className:"card border-t-2 mt-2 px-4 py-4 flex"},I("div",{className:"flex-1"},I("div",{className:"flex"},I("div",{className:"w-48"},"Label:"),I("input",{className:"border-2",value:n,required:!0,onInput:a=>{if(a instanceof InputEvent&&a.currentTarget instanceof HTMLInputElement){const n=a.currentTarget.value;t(C(w({},e),{label:n}))}}})),I(ne,{availableTypes:H,type:r,onChange:a=>{t(C(w({},e),{type:a}))}}),r===f.Collection&&I(re,{onChange:a=>{t(C(w({},e),{subtype:a}))},selected:e.subtype}),r===f.Enum&&I(se,{onChange:a=>{t(C(w({},e),{enumSet:a}))},values:e.enumSet})),I("div",{className:"w-10"},I("button",{onClick:a,className:"btn-neutral p-2",title:"Delete this attribute"},I("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},I("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:5,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})))))},ne=({availableTypes:e,type:t,onChange:a})=>I("div",{className:"flex mt-2"},I("div",{className:"w-48"},"Type:"),I("select",{onChange:e=>{e.currentTarget instanceof HTMLSelectElement&&a(+e.currentTarget.value)},className:"border-2",value:t},e.map((e=>I("option",{value:e,selected:e===t},le(e)))))),re=({selected:e,onChange:t})=>{const a=O(He).getSchemata;return I("div",{className:"flex mt-2"},I("div",{className:"w-48"},"Being a group of:"),I("select",{onChange:e=>{e.currentTarget instanceof HTMLSelectElement&&t(e.currentTarget.value)},value:e,className:"border-2"},a.map((e=>e.name)).map((e=>I("option",{value:e},e)))))},se=({values:e,onChange:t})=>I("div",null,I("div",{className:"flex mt-2"},I("div",{className:"w-48"},"With values:"),I("div",{className:e?"mr-4":""},null==e?void 0:e.map(((a,n)=>I("div",{className:"flex-1 w-96"},I("input",{className:"border-2 w-96",required:!0,value:a,onInput:a=>((a,n)=>{if(n.currentTarget instanceof HTMLInputElement){const r=void 0!==e?[...e]:[""];r[a]=n.currentTarget.value,t(r)}})(n,a)},a))))),I("button",{onClick:()=>{if(e){const a=[...e,""];t(a)}else{t([""])}},className:"btn-primary px-4 h-12"},I("span",{className:""},"Add new option")))),le=e=>{switch(e){case f.Boolean:return"Yes / No";case f.Date:return"Date";case f.Enum:return"Option list";case f.Number:return"Number";case f.Collection:return"Group of other Schema(s)";case f.Optional:return"Optional value";default:return e}},oe=({store:e})=>{const[t,a]=k(w({index:e.getSchemata.length},{name:"",attributes:[]})),[n,r]=k(!1),[s,l]=k(!0),[o,u]=k(!1);L((()=>{a(w({index:e.getSchemata.length},{name:"",attributes:[]}))}),[e]);const{index:c}=t;return I(E,null,I("div",{className:"border-2 bg-blue-100 border-blue-200 rounded-md mt-4 p-4"},I("div",{className:"flex"},I("h1",{className:"font-semibold text-xl"},"All schemata (click each one to edit):"),I("div",{className:"flex-1"}),I("button",{onClick:()=>u(!o),className:"btn-dev"},"<dev> Toggle JSON"),I("button",{onClick:()=>l(!s),className:"btn-primary ml-2"},s?"Collapse":"Expand")),I("div",{className:"mt-4"},0===e.getSchemata.length?I("div",{className:"mt-2"},'No schemata yet! Press "Add new Schema" below to create your first schema.'):s&&e.getSchemata.map(((t,n)=>I("div",{onClick:()=>(t=>{r(!0),a(w({index:t},e.getSchemata[t]))})(n),className:"card mt-2 px-4 py-2 flex cursor-pointer hover:bg-gray-100"},I("span",{className:"w-36 text-2xl"},t.name),I("span",{className:"flex-1 flex content-center"},o&&JSON.stringify(t))))))),!n&&I("button",{onClick:()=>r(!0),className:"btn-primary mt-6"},"Add new Schema"),n&&I(te,{schema:t,updateHandler:(i=c,t=>{e.editSchema(i,t),r(!1)}),key:c}));var i},ue=A(_()),ce=({rule:e,index:t,ruleUpdateHandler:a})=>{const n=O(He),r=n.getSchemata;return I("div",{className:"card border-2 w-11/12 px-4 py-4 mt-4"},I("h1",{className:"font-semibold text-xl"},"Rule ",t+1),I("div",{className:"flex"},I("h2",{className:"text-lg font-semibold"},"involving the schema:"),I("select",{onChange:e=>{if(e.currentTarget instanceof HTMLSelectElement){const t=e.currentTarget.value,r=n.getSchema(t);a({input:r,expr:Z()})}},value:e.input.name,className:"font-semibold ml-2"},r.map((e=>I("option",{value:e.name},e.name))))),I(ue.Provider,{value:e},I(ie,{rule:e,exprUpdateHandler:t=>{a(C(w({},e),{expr:t}))}})))},ie=({rule:t,exprUpdateHandler:a})=>{const n=O(He),{input:r}=t,s=t.expr,{op:l}=s,o=[e.And,e.Or];return I("div",{className:"p-2 mt-2"},s.args.length>1&&I("select",{onChange:e=>{if(e.currentTarget instanceof HTMLSelectElement){const t=e.currentTarget.value;a(C(w({},s),{op:t}))}},value:l,className:"text-3xl font-semibold"},o.map((e=>I("option",{value:e},e)))),I("span",{className:"ml-4 font-semibold text-lg"},l===e.And?"All of the following:":"At least one of the following:"),I("div",null,s.args.map(((e,t)=>fe(e,(e=>t=>{if(we(s)){const n=ee(s.args,e,t);a(C(w({},s),{args:n}))}})(t))))),I("button",{onClick:()=>{if(we(s)){const e=s.args,t=pe(n,r);a(C(w({},s),{args:e.concat(t)}))}},className:"btn-primary text-md font-semibold mt-4"},"New condition"),I("button",{onClick:()=>{if(we(s)){const t=s.args,l={args:[pe(n,r)],op:e.And};a(C(w({},s),{args:t.concat(l)}))}},className:"btn-primary text-md font-semibold mt-4 ml-2"},"New logic group"))},me=({expr:t,exprUpdateHandler:a})=>{const n=O(He),r=O(ue),{op:s}=t,l=[e.And,e.Or];return I("div",{className:"card border-2 border-gray-300 p-2 mt-2"},t.args.length>1&&I("select",{onChange:e=>{if(e.currentTarget instanceof HTMLSelectElement){const n=e.currentTarget.value;a(C(w({},t),{op:n}))}},value:s,className:"text-xl font-semibold"},l.map((e=>I("option",{value:s},e)))),t.args.map(((e,n)=>I("div",{id:"test-sep",class:"mt-2"},fe(e,(e=>n=>{if(we(t)){const r=ee(t.args,e,n);a(C(w({},t),{args:r}))}})(n))))),I("button",{onClick:()=>{if(we(t)){const e=t.args,s=pe(n,r.input);a(C(w({},t),{args:e.concat(s)}))}},className:"btn-primary text-sm font-normal mt-4"},"New condition"),I("button",{onClick:()=>{if(we(t)){const s=t.args,l={args:[pe(n,r.input)],op:e.And};a(C(w({},t),{args:s.concat(l)}))}},className:"btn-primary text-sm font-normal mt-4 ml-2"},"New logic group"))},pe=(e,t)=>{const a=t.attributes[0],{label:n}=a,r={args:[n],op:b.Lookup};return de(e,a,r)},de=(e,t,a)=>{switch(t.type){case f.Model:const n=e.getSchema(t.subtype).attributes[0],{label:r}=n,s={args:[r,a],op:b.Lookup};return de(e,n,s);case f.Collection:return(()=>{const n=e.getSchema(t.subtype);return{args:[a,pe(e,n)],op:i.AnyOf}})();case f.Enum:return{args:[a,t.enumSet[0]],op:l.Is};default:return be(t.type,a)}},be=(e,t)=>{switch(e){case f.Date:return{args:[t,Date.now()],op:a.IsAfter};case f.Number:return{args:[t,0],op:r.Equal};case f.Boolean:return{args:[t],op:u.IsChecked};case f.Optional:return{args:[t],op:p.Exists};default:return Z()}},fe=(t,n)=>{switch(t.op){case b.Lookup:return I(he,{exp:t,exprUpdateHandler:n});case r.Equal:case r.LessThan:case r.LessThanOrEqual:case r.MoreThan:case r.MoreThanOrEqual:return I(ye,{exp:t,exprUpdateHandler:n});case i.AllOf:case i.AnyOf:case i.NoneOf:case i.NumberOf:case i.Size:return I(ve,{exp:t,exprUpdateHandler:n});case a.IsAfter:case a.IsBefore:case a.IsBetween:return I(Ne,{exp:t,exprUpdateHandler:n});case l.Is:case l.IsNot:return I(Se,{exp:t,exprUpdateHandler:n});case u.IsChecked:case u.IsNotChecked:return I(Te,{exp:t,exprUpdateHandler:n});case p.Exists:case p.ExistsAnd:return I(ge,{exp:t,exprUpdateHandler:n});case e.And:case e.Or:return I(me,{expr:t,exprUpdateHandler:n});default:return I("div",{class:"border-2"},JSON.stringify(t))}},ge=({exprUpdateHandler:e,exp:t})=>I("div",null,"Optional operations"),he=({exprUpdateHandler:e,exp:t})=>{const a=O(ue),n=a.input.attributes.map((e=>e.label)),r=t.args[0],s=O(He);return I("select",{onChange:n=>{if(n.currentTarget instanceof HTMLSelectElement){const r=n.currentTarget.value,l=a.input.attributes.find((e=>e.label===r)),o=C(w({},t),{args:[r]}),u=de(s,l,o);e(u)}},value:r},n.map((e=>I("option",{value:e},e))))},ve=({exprUpdateHandler:e,exp:t})=>{const a=[i.AllOf,i.AnyOf,i.NoneOf,i.NumberOf,i.Size],{args:n,op:r}=t,[s,l]=n,o=a=>{const r=[n[0],a];e(C(w({},t),{args:r}))},u=O(ue).input.attributes,c=O(He);return I("div",{className:"mt-4"},fe(s,(t=>{e(t)})),I("select",{onChange:a=>{if(a.currentTarget instanceof HTMLSelectElement){const r=a.currentTarget.value;if(r===i.Size){const t=[n[0]],a=be(f.Number,{args:t,op:r});return e(a)}if(r===i.NumberOf){const a=be(f.Number,C(w({},t),{op:r}));return e(a)}e(C(w({},t),{op:r}))}},value:r},a.map((e=>I("option",{value:e},e)))),we(l)&&(e=>{const a=t.args[0].args[0],n=u.find((e=>e.label===a)).subtype,r=c.getSchema(n),s=C(w({},_()),{input:r});return I(ue.Provider,{value:s},I(xe,{exprUpdateHandler:o,exp:e}))})(l))},xe=({exprUpdateHandler:e,exp:t})=>{const a=O(ue);return I(E,null,a.input.name,fe(t,e))},Ne=({exprUpdateHandler:e,exp:t})=>{const n=[a.IsAfter,a.IsBefore,a.IsBetween],{args:r,op:s}=t,[l,o,u]=r;return I(E,null,fe(l,(t=>{e(t)})),I("select",{onChange:a=>{if(a.currentTarget instanceof HTMLSelectElement){const n=a.currentTarget.value;e(C(w({},t),{op:n}))}},value:s},n.map((e=>I("option",{value:e},Ce(e))))),I("input",{type:"date",name:"Date",onInput:a=>{if(a.currentTarget instanceof HTMLInputElement){const n=JSON.parse(a.currentTarget.value),s=[r[0],n];e(C(w({},t),{args:s}))}},value:o}),s===a.IsBetween&&I(E,null,"And",I("input",{type:"date",name:"Date",onInput:n=>{if(s===a.IsBetween&&n.currentTarget instanceof HTMLInputElement){const a=JSON.parse(n.currentTarget.value),s=[r[0],r[1],a];e(C(w({},t),{args:s}))}},value:u})))},ye=({exprUpdateHandler:e,exp:t})=>{const a=[r.Equal,r.LessThan,r.LessThanOrEqual,r.MoreThan,r.MoreThanOrEqual],{args:n,op:s}=t,[l,o]=n;return I(E,null,fe(l,(t=>{e(t)})),I("select",{onChange:a=>{if(a.currentTarget instanceof HTMLSelectElement){const n=a.currentTarget.value;e(C(w({},t),{op:n}))}},value:s},a.map((e=>I("option",{value:e},Ce(e))))),I("input",{type:"number",name:"Number",onInput:a=>{if(a.currentTarget instanceof HTMLInputElement){const r=JSON.parse(a.currentTarget.value),s=[n[0],r];e(C(w({},t),{args:s}))}},value:o}))},Se=({exprUpdateHandler:e,exp:t})=>{const a=[l.Is,l.IsNot],n=O(ue).input.attributes,r=t.args[0].args[0],s=n.find((e=>e.label===r)).enumSet,{args:o,op:u}=t,[c,i]=o;return I("div",null,fe(c,(t=>{e(t)})),I("select",{onChange:a=>{if(a.currentTarget instanceof HTMLSelectElement){const n=a.currentTarget.value;e(C(w({},t),{op:n}))}},value:u},a.map((e=>I("option",{value:e},Ce(e))))),I("select",{onChange:a=>{if(a.currentTarget instanceof HTMLInputElement){const n=JSON.parse(a.currentTarget.value),r=[o[0],n];e(C(w({},t),{args:r}))}},value:i},s.map((e=>I("option",{value:e},e)))))},Te=({exprUpdateHandler:e,exp:t})=>{const a=[u.IsChecked,u.IsNotChecked],{args:n,op:r}=t,[s]=n;return I("div",{className:"mt-2"},fe(s,(t=>{e(t)})),I("select",{onChange:a=>{if(a.currentTarget instanceof HTMLSelectElement){const n=a.currentTarget.value;e(C(w({},t),{op:n}))}},value:r},a.map((e=>I("option",{value:e},Ce(e))))))},we=e=>"object"==typeof e&&"op"in e,Ce=e=>{switch(e){case b.Lookup:case r.Equal:return"Equals";case r.LessThan:return"Is less than";case r.LessThanOrEqual:return"Is less than or equal to";case r.MoreThan:return"Is more than";case r.MoreThanOrEqual:return"Is more than or equal to";case i.AllOf:case i.AnyOf:case i.NoneOf:case i.NumberOf:case i.Size:return"Size";case a.IsAfter:return"Is after";case a.IsBefore:return"Is before";case a.IsBetween:return"Is between";case l.Is:return"Is";case l.IsNot:return"Is not";case u.IsChecked:return"Is true";case u.IsNotChecked:return"Is not true";case p.Exists:return"Exists";case p.ExistsAnd:return"Exists and";default:return e}},Ie=({ruleSet:e,updateHandler:t})=>{const a=O(He).getSchemata,[n,r]=k(e),[s,l]=k(""),{title:o,rules:u}=n,c=e=>t=>{r((a=>{const{rules:n}=a;return C(w({},a),{rules:ee(n,e,t)})}))};return I("div",{className:"card mt-12 px-4 py-4"},I("div",null,I("h1",{className:"font-semibold text-2xl"},"New Ruleset"),I("div",{className:"mt-4"},I("input",{type:"text",value:o,placeholder:"Title of ruleset",onInput:e=>{if(e instanceof InputEvent&&e.currentTarget instanceof HTMLInputElement){const t=e.currentTarget.value;r((e=>C(w({},e),{title:t})))}},className:"text-xl font-semibold py-2 px-2 w-1/2"})),I("h2",{className:"text-lg font-semibold mt-6"},"Rules (disjunctive):"),u.map(((e,t)=>I(ce,{rule:e,index:t,ruleUpdateHandler:c(t)}))),I("button",{onClick:()=>{if(0===a.length)return l("Add new Schema first"),void setTimeout((()=>{l("")}),1e3);const e=C(w({},_()),{input:a[0]}),t=u.concat(e);r((e=>C(w({},e),{rules:t})))},className:"btn-primary mt-8"},"Add new rule")),s&&I("div",null,s),I("button",{onClick:()=>t(n),className:"btn-good mt-10"},"Done"))},Ee=({store:e})=>{const[t,a]=k(w({index:e.getRuleSets.length},{rules:[],title:""})),[n,r]=k(!1);L((()=>{a(w({index:e.getRuleSets.length},{rules:[],title:""}))}),[e]);const{index:s}=t,[l,o]=k(!1),[u,c]=k(!0);return I(E,null,I("div",null,"Ruleset Editor"),I("div",{className:"border-2 bg-blue-100 border-blue-200 rounded-md mt-4 p-4"},I("div",{className:"flex"},I("div",{className:"font-semibold text-xl"},"All rulesets:"),I("div",{className:"flex-1"}),I("button",{onClick:()=>o(!l),className:"btn-dev"},"<dev> Toggle JSON"),I("button",{onClick:()=>c(!u),className:"btn-primary ml-2"},u?"Collapse":"Expand")),u&&e.getRuleSets.map(((t,n)=>I("div",{className:"card mt-2 px-4 py-2 flex cursor-pointer hover:bg-gray-100",onClick:()=>(t=>{r(!0),a(w({index:t},e.getRuleSets[t]))})(n)},I("span",{className:"text-2xl w-64"},t.title),I("span",{className:"flex-1"},l&&JSON.stringify(t,null,2)))))),I("div",{className:"text-center mt-10 font-semibold"},"Tip: An activity is considered permitted if any rule evaluates to TRUE."),n?I(Ie,{ruleSet:t,updateHandler:(i=s,t=>{e.editRuleSet(i,t),r(!1)}),key:s}):I("button",{onClick:()=>r(!0),className:"btn-primary mt-12"},"Add new Ruleset"));var i};var ke;!function(e){e.Schema="schema",e.RuleSet="ruleset"}(ke||(ke={}));const Oe=()=>{const[e,t]=k(ke.Schema),a=O(He);return I("div",{className:"mt-16 border-gray-200 px-24"},I("h1",null,"CURATOR VIEW"),I("div",{class:"mx-auto mt-4 flex w-48 rounded-md border-2 border-gray-300 bg-gray-100"},I("div",{class:`curatorbutton flex-1 w-16 h-10 border-r-2 border-gray-200 cursor-pointer flex items-center justify-center rounded-l-sm \n            ${e===ke.Schema&&"bg-white"}`,onClick:()=>t(ke.Schema)},"Schema"),I("div",{class:`consumerbutton flex-1 w-16 h-10 cursor-pointer flex items-center justify-center rounded-r-sm \n            ${e===ke.RuleSet&&"bg-white"}`,onClick:()=>t(ke.RuleSet)},"Ruleset")),(e=>{switch(e){case ke.Schema:return I(oe,{store:a});case ke.RuleSet:return I(Ee,{store:a})}})(e))};class Le{constructor(e,t){this.addSchema=e=>{const t=this.ruleStore.schemata.concat(e);this.setFn(C(w({},this.ruleStore),{schemata:t}))},this.editSchema=(e,t)=>{let a=this.ruleStore.schemata.slice();a[e]=t,this.setFn(C(w({},this.ruleStore),{schemata:a}))},this.editRuleSet=(e,t)=>{let a=this.ruleStore.ruleSets.slice();a[e]=t,this.setFn(C(w({},this.ruleStore),{ruleSets:a}))},this.getSchema=e=>{const t=this.ruleStore.schemata.find((t=>t.name===e));if(void 0===t)throw new Error("schema not in rulestore");return t},this.setFn=t,this.ruleStore=e}get getSchemata(){return this.ruleStore.schemata}get getRuleSets(){return this.ruleStore.ruleSets}}const Ae=()=>({schemata:[{name:"Gathering",attributes:[{label:"Group",type:f.Collection,subtype:"Person"},{label:"All from same household",type:f.Boolean}]},{name:"Person",attributes:[{label:"Age",type:f.Number},{label:"Is fully vaccinated",type:f.Boolean},{label:"Type of vaccine",type:f.Enum,enumSet:["Pfizer","Moderna","Sinovac","Other"]},{label:"Date of vaccination",type:f.Date}]},{name:"MICE event pilots",attributes:[{label:"Participants are all fully vaccinated",type:f.Boolean},{label:"Type of event",type:f.Enum,enumSet:["Participants are predominantly seated or standing in a fixed position during the session.","Participants are predominantly non-seated and moving about during the session."]},{label:"Number of participants",type:f.Number}]}],ruleSets:[D,J]});var Me;!function(e){e.Curator="curator",e.Consumer="consumer"}(Me||(Me={}));const He=A(new Le(Ae(),(()=>{})));function Be(){const[e,t]=k(Me.Consumer),[a,n]=k(Ae()),r=new Le(a,n);return I(E,null,I("div",{class:"App py-10"},I("div",{class:"mx-auto mt-4 flex w-48 rounded-md border-2 border-gray-300"},I("div",{class:"curatorbutton flex-1 w-16 h-10 border-r-2 border-gray-200 cursor-pointer flex items-center justify-center rounded-l-sm\n            "+(e===Me.Curator?"bg-white":""),onClick:()=>t(Me.Curator)},"Curator"),I("div",{class:"consumerbutton flex-1 w-16 h-10 cursor-pointer flex items-center justify-center rounded-r-sm\n            "+(e===Me.Consumer?"bg-white":""),onClick:()=>t(Me.Consumer)},"Consumer"))),I(He.Provider,{value:r},(e=>{switch(e){case Me.Curator:return I(Oe,null);case Me.Consumer:return I(Q,null)}})(e)))}M(I(Be,null),document.getElementById("app"));
