import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/lib/ad-network-plugin.js',import.meta.url),'utf8').replace(/export\s*\{\s*AdNetworkFactory\s*\};?\s*$/, 'globalThis.factory = AdNetworkFactory;');
function network({state='default',viewable=true,userAgent='Android',withMraid=true}={}) {
 const listeners=new Map(),opened=[];
 const sdk={getState:()=>state,isViewable:()=>viewable,addEventListener(name,fn){const set=listeners.get(name)??new Set();set.add(fn);listeners.set(name,set);},removeEventListener(name,fn){listeners.get(name)?.delete(fn);},open:url=>opened.push(url)};
 const context={navigator:{userAgent},window:{},console:{log(){},warn(){}},URL,...(withMraid?{mraid:sdk}:{})};vm.createContext(context);vm.runInContext(source,context);
 return {ad:context.factory.createAdNetwork('applovin'),opened,ready(){state='default';for(const fn of [...listeners.get('ready')??[]])fn();},visible(value){viewable=value;for(const fn of [...listeners.get('viewableChange')??[]])fn(value);},listeners};
}
test('loading, ready and viewable defer initialization and start only once',()=>{
 const n=network({state:'loading',viewable:false});let games=0;n.ad.initMraid(()=>games++);assert.equal(games,0);n.visible(true);assert.equal(games,0);n.ready();assert.equal(games,1);n.ready();n.visible(true);n.visible(false);n.visible(true);n.ad.initMraid(()=>games++);assert.equal(games,1);
});
test('ready but hidden waits for viewability; ready/viewable and local development start once',()=>{
 const hidden=network({viewable:false});let games=0;hidden.ad.initMraid(()=>games++);assert.equal(games,0);hidden.visible(true);assert.equal(games,1);
 for(const config of [{},{withMraid:false}]){const n=network(config);let count=0;n.ad.initMraid(()=>count++);n.ad.initMraid(()=>count++);assert.equal(count,1);}
});
test('platform CTA uses the supplied HTTPS store URL and rejects missing or hostile links',()=>{
 const google='https://play.google.com/store/apps/details?id=test';const apple='https://apps.apple.com/us/app/test/id123';
 for(const [userAgent,expected] of [['Android',google],['iPhone',apple]]){const n=network({userAgent});n.ad.ctaPressed(google,apple);assert.equal(n.opened[0],expected);for(const invalid of [undefined,'','javascript:alert(1)','https://attacker.test/store','https://user:password@apps.apple.com/test'])n.ad.ctaPressed(invalid,invalid);assert.equal(n.opened.length,1);}
});
test('bootstrap accepts only configured parent/source, protocol and SDK origins',()=>{
 const html=readFileSync(new URL('../src/injections/ironsource.html',import.meta.url),'utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('var trustedParentOrigins = [];','var trustedParentOrigins = ["https://host.test"];').replace('var trustedSdkOrigins = [];','var trustedSdkOrigins = ["https://sdk.test"];');
 const scripts=[],sent=[],parent={postMessage:(...args)=>sent.push(args)},listeners=new Map();const window={parent,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 const context={window,document:{createElement:()=>({}),head:{appendChild:script=>scripts.push(script)}},URL,console};vm.createContext(context);vm.runInContext(script,context);assert.equal(sent[0][1],'https://host.test');
 const valid='$$DAPI_SERVICE:'+JSON.stringify({name:'connection.getDapiUrl',data:'https://sdk.test/dapi.js'});
 for(const data of [null,{},42,'$$DAPI_SERVICE:{','wrong','$$DAPI_SERVICE:'+JSON.stringify({name:'unknown',data:'https://sdk.test/dapi.js'})])context.getDapi({source:parent,origin:'https://host.test',data});
 context.getDapi({source:{},origin:'https://host.test',data:valid});context.getDapi({source:parent,origin:'https://other.test',data:valid});
 for(const url of ['http://sdk.test/dapi.js','https://attacker.test/dapi.js','javascript:alert(1)','https://user:pw@sdk.test/dapi.js'])context.getDapi({source:parent,origin:'https://host.test',data:'$$DAPI_SERVICE:'+JSON.stringify({name:'connection.getDapiUrl',data:url})});
 assert.equal(scripts.length,0);context.getDapi({source:parent,origin:'https://host.test',data:valid});context.getDapi({source:parent,origin:'https://host.test',data:valid});assert.equal(scripts.length,1);assert.equal(scripts[0].src,'https://sdk.test/dapi.js');
});
