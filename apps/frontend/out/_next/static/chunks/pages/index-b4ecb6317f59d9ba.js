(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{7314:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(3947)}])},1772:function(e,t,r){"use strict";var n=r(2322),a=r(2784),s=r(4061),i=r(3022);t.Z=e=>{let{data:t}=e,r=(0,a.useRef)(null);return(0,a.useEffect)(()=>{t&&"undefined"!==t&&s.toCanvas(r.current,t,async e=>{var r,n;e&&await (null===(n=window.pywebview)||void 0===n?void 0:null===(r=n.api)||void 0===r?void 0:r.log(e)),await (0,i.Z)("Created QR: ".concat(t))})},[t]),(0,n.jsx)("canvas",{ref:r})}},789:function(e,t,r){"use strict";var n=r(1286),a=r(1074);t.Z=e=>{let{data:t,error:r}=(0,n.ZP)("/hardware-id",a.Od,{revalidateIfStale:!1,revalidateOnFocus:!1,revalidateOnReconnect:!1,...e});return{hwid:t,isLoading:!r&&!t,isError:r}}},3947:function(e,t,r){"use strict";r.r(t);var n=r(2322),a=r(8261),s=r(2784),i=r(3635),l=r(2005),d=r(9097),c=r.n(d),u=r(5632),o=r(3781),f=r(1772),x=r(789);t.default=()=>{let[e,t]=(0,s.useState)("Initial-Lizz-ing..."),{hwid:r}=(0,x.Z)(),d=(0,u.useRouter)();return(0,s.useEffect)(()=>{if(r){let e=2,r=setInterval(()=>{t("Starting in ".concat(e," seconds...")),e-=1},1e3);setTimeout(()=>{clearInterval(r),t("starting..."),d.push("/dashboard")},1e3*e)}},[r,d]),(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)("div",{className:"flex h-full flex-col justify-between",children:[(0,n.jsxs)(a.Ol,{children:[(0,n.jsx)(a.ll,{children:"LizzControl"}),(0,n.jsx)(a.SZ,{children:e})]}),(0,n.jsx)("div",{className:"flex flex-col items-center justify-center",children:(0,n.jsx)(f.Z,{data:r})}),(0,n.jsxs)(c(),{className:(0,o.d)(),href:"/dashboard",passHref:!0,...r?{}:{disabled:!0},children:["Dashboard"," ",r?(0,n.jsx)(i.Z,{}):(0,n.jsx)(l.Z,{className:"ml-2 h-4 w-4 animate-spin"})]})]})})}},3635:function(e,t,r){"use strict";var n=r(4339),a=r(2322);t.Z=(0,n.Z)((0,a.jsx)("path",{d:"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),"NavigateNext")},2005:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r(5132).Z)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},8261:function(e,t,r){"use strict";r.d(t,{Ol:function(){return l},SZ:function(){return c},Zb:function(){return i},aY:function(){return u},eW:function(){return o},ll:function(){return d}});var n=r(2322),a=r(2784),s=r(1344);let i=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("rounded-xl border bg-card text-card-foreground shadow",r),...a})});i.displayName="Card";let l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",r),...a})});l.displayName="CardHeader";let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("h3",{ref:t,className:(0,s.cn)("font-semibold leading-none tracking-tight",r),...a})});d.displayName="CardTitle";let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("p",{ref:t,className:(0,s.cn)("text-sm text-muted-foreground",r),...a})});c.displayName="CardDescription";let u=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("p-6 pt-0",r),...a})});u.displayName="CardContent";let o=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("flex items-center p-6 pt-0",r),...a})});o.displayName="CardFooter"}},function(e){e.O(0,[97,339,61,888,774,179],function(){return e(e.s=7314)}),_N_E=e.O()}]);