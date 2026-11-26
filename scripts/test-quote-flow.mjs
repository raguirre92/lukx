import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRequire = createRequire(path.join(root,'package.json'));
const ts = projectRequire('typescript');
const cache = new Map();
const mocks = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const compiledModule = { exports: {} };
  cache.set(file,compiledModule);
  let code = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop:true, target:ts.ScriptTarget.ES2022 } }).outputText;
  if (file === path.join(root, "src/lib/odoo.ts")) code += "\nexports.testLeadValues = leadValues;\nexports.testCustomFallbacks = customFallbacks;";
  const localRequire = (name) => {
    if(mocks.has(name)) return mocks.get(name);
    if(name.startsWith('@/') || name.startsWith('.')) {
      let target=name.startsWith('@/') ? path.join(root,'src',name.slice(2)) : path.resolve(path.dirname(file),name);
      for(const extension of ['', '.ts', '.tsx', '.json']) if(fs.existsSync(target+extension) && fs.statSync(target+extension).isFile()) return extension==='.json' ? JSON.parse(fs.readFileSync(target+extension,'utf8')) : load(target+extension);
    }
    return projectRequire(name);
  };
  new Function('require','module','exports',code)(localRequire,compiledModule,compiledModule.exports);
  return compiledModule.exports;
}
const flow=load(path.join(root,'src/lib/quote-flow.ts'));
const empty=()=>({...flow.EMPTY_QUOTE_ANSWERS});
const ids=(sector,answers)=>flow.getQuoteQuestions(sector,answers).map(q=>q.id);
let routes=0;
for(const sector of ['residencial','comercial','industrial']) {
  const options=flow.getQuoteQuestions(sector,empty())[0].options;
  for(const interest of options) for(const panels of ['Sí','No']) {
    const answers={...empty(),interes:interest,tiene_paneles:panels};
    const list=flow.getQuoteQuestions(sector,answers);
    const steps=ids(sector,answers);
    assert.equal(steps[0],'interes');
    assert.equal(new Set(steps).size,steps.length);
    assert.equal(steps.includes('recibo'),interest==='Paneles solares'||interest==='Ambos');
    assert.equal(steps.includes('equipos'),interest==='Sistemas de respaldo'||interest==='Ambos');
    assert.equal(steps.includes('autonomia'),false);
    if(steps.includes('equipos')) assert.equal(list.find(q=>q.id==='equipos').multiple,true);
    assert.equal(steps.includes('area_iluminacion'),interest==='Iluminación');
    assert.equal(steps.includes('uso_carga'),interest==='Estaciones de carga');
    assert.equal(steps.includes('objetivo_solar'),steps.includes('recibo')&&panels==='Sí');
    assert.equal(list.find(q=>q.id==='ciudad').title.includes('tu casa'),sector==='residencial');
    if(steps.includes('recibo')) assert.equal(list.find(q=>q.id==='recibo').title.includes('bimestre'),sector==='residencial');
    for(const question of list) answers[question.id]=answers[question.id]||question.options?.[0]||'Equipos de prueba';
    const responses=flow.quoteResponses(sector,answers,'Comentario de prueba');
    for(const question of list) assert.ok(responses.Comentarios.includes(answers[question.id]));
    routes++;
  }
}
const stale={...empty(),interes:'Paneles solares',tiene_paneles:'Sí',recibo:'Más de 10,000 pesos',objetivo_solar:'Ampliar mi sistema'};
const lighting=flow.updateQuoteAnswers('comercial',stale,'interes','Iluminación');
assert.equal(lighting.recibo,'');assert.equal(lighting.tiene_paneles,'');assert.equal(lighting.objetivo_solar,'');
assert.ok(!flow.quoteResponses('comercial',lighting,'').Comentarios.includes('10,000'));
const noPanels=flow.updateQuoteAnswers('residencial',stale,'tiene_paneles','No');
assert.equal(noPanels.objetivo_solar,'');
for(const space of ['Mi casa','Mi negocio','Mi planta o nave']) {
  const answers={...empty(),espacio:space,interes:'Paneles solares'};
  assert.ok(ids('asesoria',answers).includes('espacio'));
  assert.ok(flow.getQuoteQuestions('asesoria',answers).find(q=>q.id==='ciudad').title.includes(space==='Mi casa'?'tu casa':space==='Mi negocio'?'tu negocio':'tu planta o nave'));
}
console.log(`PASS: ${routes} sector/solution/install combinations, branch pruning, bill periods and CRM summaries.`);


mocks.set('server-only',{});
const {testLeadValues}=load(path.join(root,'src/lib/odoo.ts'));
const input={name:'Prueba',email:'prueba@example.invalid',whatsapp:'5512345678',pendingFields:{},replaceSolutionDetails:true};
const lightingValues=testLeadValues({...input,solution:'Iluminación',recibo:''},null,new Date(),[],false);
assert.equal(lightingValues.x_studio_solucin,false);
assert.equal(lightingValues.x_studio_gasto_en_recibo_de_luz,false);
const solarValues=testLeadValues({...input,solution:'Paneles solares',recibo:'Entre 0 y 3,000 pesos'},null,new Date(),[],false);
assert.equal(solarValues.x_studio_gasto_en_recibo_de_luz,'Entre 0 y 3,000 pesos');
assert.equal(solarValues.x_studio_solucin,false);
const backupValues=testLeadValues({...input,solution:'Sistemas de respaldo'},null,new Date(),[],false);
assert.equal(backupValues.x_studio_solucin,'Sistemas de respaldo');
const legacyValues=testLeadValues({...input,replaceSolutionDetails:false,solution:'Paneles solares'},null,new Date(),[],false);
assert.equal(Object.hasOwn(legacyValues,'x_studio_solucin'),false);
assert.equal(Object.hasOwn(legacyValues,'x_studio_gasto_en_recibo_de_luz'),false);
console.log('PASS: changing solution clears stale billing/backup CRM fields, with other forms unchanged. No CRM calls.');

const otherCity = {...empty(), interes:'Sistemas de respaldo', ciudad:'Otro', ciudad_otra:'Santiago, Nuevo León'};
assert.ok(ids('residencial',otherCity).includes('ciudad_otra'));
assert.equal(flow.quoteResponses('residencial',otherCity,'')['Otra ciudad o municipio'],'Santiago, Nuevo León');
const listedCity=flow.updateQuoteAnswers('residencial',otherCity,'ciudad','Monterrey');
assert.equal(listedCity.ciudad_otra,'');
assert.ok(!ids('residencial',listedCity).includes('ciudad_otra'));

for (const sector of ['comercial','industrial']) {
  for (const [interest, field, selection, detail] of [
    ['Iluminación','area_iluminacion','Oficinas; Otro','area_iluminacion_otra'],
    ['Sistemas de respaldo','equipos','Refrigeración; Otros equipos','equipos_otro'],
    ['Estaciones de carga','uso_carga','Flotilla de la empresa; Otro','uso_carga_otro'],
    ['Paneles solares','objetivo_solar','Otro','objetivo_solar_otro'],
    ['Iluminación','proyecto_iluminacion','Otro','proyecto_iluminacion_otro'],
  ]) {
    const answers={...empty(),interes:interest,tiene_paneles:'Sí',[field]:selection,[detail]:'Detalle específico'};
    const list=flow.getQuoteQuestions(sector,answers);
    assert.ok(list.some(q=>q.id===detail));
    const question=list.find(q=>q.id===detail);
    assert.equal(flow.quoteResponses(sector,answers,'')[question.title],'Detalle específico');
    const changed=flow.updateQuoteAnswers(sector,answers,field,'Otra opción de prueba');
    assert.equal(changed[detail],'');
    assert.ok(!ids(sector,changed).includes(detail));
  }
}
console.log('PASS: conditional Other details are separate and cleared when deselected in both business sectors.');

async function integration() {
  const { JSDOM } = projectRequire('jsdom');
  const dom = new JSDOM('<div id="root"></div>', {url:'http://localhost:3000/lp/residencial'});
  for(const key of ['window','document','HTMLElement','HTMLInputElement','HTMLDialogElement','Event','MouseEvent']) global[key]=dom.window[key];
  global.IS_REACT_ACT_ENVIRONMENT=true;
  global.IntersectionObserver=class {observe(){} disconnect(){}};
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  const React=projectRequire('react');
  const {createRoot}=projectRequire('react-dom/client');
  const {act}=React;
  const nullComponent=()=>null;
  for(const name of ['@/components/FaqAccordion','@/components/HeroScrim','@/components/ProjectGallery','@/components/home/ProjectsCarousel','@/components/agendar/ExitIntentLead']) mocks.set(name,{__esModule:true,default:nullComponent});
  mocks.set('@/components/BookingScheduler',{__esModule:true,default:()=>React.createElement('p',null,'Agenda disponible')});
  mocks.set('next/image',{__esModule:true,default:({src,alt})=>React.createElement('img',{src,alt})});
  mocks.set('@iconify/react',{Icon:()=>null});
  mocks.set('@/lib/attribution',{captureAttribution:()=>({}),pushDataLayer:()=>{}});
  const posts=[];
  let failNext=false;
  global.fetch=async (url,options)=>{if(failNext){failNext=false;return {ok:false,json:async()=>({error:'Error simulado'})};}assert.equal(url,'/api/lead');posts.push(JSON.parse(options.body));return {ok:true,json:async()=>({leadToken:'local-test-token'})};};
  const Component=load(path.join(root,'src/components/agendar/ResidencialSpaceQuote.tsx')).default;
  const OptionIcon=load(path.join(root,'src/components/agendar/QuoteOptionIcon.tsx')).default;
  const {renderToStaticMarkup}=projectRequire('react-dom/server');
  for(const sector of ['comercial','industrial']) {
    const areas=flow.getQuoteQuestions(sector,{...empty(),interes:'Iluminación'}).find(q=>q.id==='area_iluminacion').options;
    const icons=areas.map(option=>renderToStaticMarkup(React.createElement(OptionIcon,{option})));
    assert.equal(new Set(icons).size,areas.length,'Area icons should be distinct');
  }
  let reactRoot;
  const findButton=(text)=>Array.from(document.querySelectorAll('dialog[open] button')).find(b=>b.textContent.trim()===text);
  async function pick(text) {
    const input=Array.from(document.querySelectorAll('dialog[open] input[type=radio]')).find(i=>i.value===text);
    assert.ok(input,`Missing choice ${text}`);
    await act(async()=>input.click());
  }
  async function submitCurrent() {
    const form=document.querySelector('dialog[open] form');assert.ok(form);
    await act(async()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));
  }
  async function city() {
    assert.equal(document.querySelector('dialog[open] select'),null);
    await pick('Monterrey');
  }
  async function check(label) {
    const input=Array.from(document.querySelectorAll('dialog[open] input[type=checkbox]')).find(i=>i.value===label);
    assert.ok(input,`Missing multiple choice ${label}`);
    await act(async()=>input.click());
  }
  async function fillDetail(value) {
    const input=document.querySelector('dialog[open] input[type=text]');assert.ok(input);
    await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
    await submitCurrent();
  }
  async function start(sector) {
    if(reactRoot) await act(async()=>reactRoot.unmount());
    reactRoot=createRoot(document.getElementById('root'));
    await act(async()=>reactRoot.render(React.createElement(Component,{pag:{h1:'Prueba',sub:'Prueba',faq:[]},pagePath:`/lp/${sector}`,content:sector==='residencial'?undefined:{linea:sector,h1:'Prueba',sub:'Prueba',faqs:[],solutions:[],process:[]}})));
    const inputs=Array.from(document.querySelectorAll('#agenda input'));
    for(const [auto,value] of [['name','Prueba Local'],['tel','5512345678'],['email','prueba@example.invalid']]) {
      const input=inputs.find(i=>i.autocomplete===auto);assert.ok(input);
      await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
    }
    await act(async()=>document.getElementById('agenda').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));
    assert.ok(document.querySelector('dialog[open] legend')?.textContent.includes('¿Qué te interesa?'));
  }
  await start('residencial');await pick('Sistemas de respaldo');await pick('Sí');await city();
  assert.equal(document.querySelector('dialog[open] textarea'),null);
  assert.equal(document.querySelectorAll('dialog[open] input[type=checkbox]').length,6);
  assert.equal(findButton('Continuar').disabled,true);
  const equipment=(name)=>Array.from(document.querySelectorAll('dialog[open] input[type=checkbox]')).find(i=>i.value===name);
  assert.ok(equipment('Aire acondicionado').closest('label').querySelector('svg'));
  await act(async()=>equipment('Refrigerador').click());
  await act(async()=>equipment('Internet').click());
  await act(async()=>equipment('Aire acondicionado').click());
  await act(async()=>equipment('Aire acondicionado').click());
  assert.equal(equipment('Refrigerador').checked,true);assert.equal(equipment('Internet').checked,true);
  assert.equal(equipment('Aire acondicionado').checked,false);
  await submitCurrent();
  assert.ok(document.querySelector('dialog[open]').textContent.includes('comentario adicional'));
  await act(async()=>findButton('Atrás').click());
  assert.equal(equipment('Refrigerador').checked,true);assert.equal(equipment('Internet').checked,true);
  await submitCurrent();await submitCurrent();
  assert.ok(document.querySelector('dialog[open]').textContent.includes('Agenda disponible'));
  assert.ok(posts.at(-1).respuestas.Comentarios.includes('Refrigerador; Internet'));
  assert.ok(!posts.at(-1).respuestas.Comentarios.includes('Aire acondicionado'));
  assert.ok(!Object.keys(posts.at(-1).respuestas).some(key=>key.includes('tiempo')));
  assert.equal(posts.at(-1).respuestas['¿Ya tienes paneles solares?'],'Sí');
  assert.equal(posts.at(-1).recibo,'');
  await start('residencial');failNext=true;await pick('Paneles solares');
  assert.ok(document.querySelector('dialog[open] legend').textContent.includes('¿Qué te interesa?'));
  assert.ok(document.querySelector('dialog[open] [role=alert]').textContent.includes('Error simulado'));
  await pick('Paneles solares');await pick('No');await city();await pick('Entre 3,001 y 6,000 pesos');
  assert.ok(document.querySelector('dialog[open]').textContent.includes('comentario adicional'));
  await start('industrial');await pick('Paneles solares');await pick('Sí');await city();await pick('$50,000 a $150,000');await pick('Ampliar mi sistema');await submitCurrent();
  assert.equal(posts.at(-1).respuestas['¿Cuánto pagas de luz al mes, aproximadamente?'],'$50,000 a $150,000');
  assert.ok(!posts.at(-1).respuestas['¿Cuánto pagas de luz al bimestre, aproximadamente?']);
  await start('residencial');await pick('Sistemas de respaldo');await pick('No');await pick('Otro');
  assert.ok(document.querySelector('dialog[open] label[for="quote-ciudad_otra"]'));
  assert.equal(findButton('Continuar').disabled,true);
  await act(async()=>{const input=document.getElementById('quote-ciudad_otra');Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(input,'Santiago, Nuevo León');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
  await submitCurrent();
  assert.equal(posts.at(-1).respuestas['Otra ciudad o municipio'],'Santiago, Nuevo León');
  assert.ok(document.querySelector('dialog[open]').textContent.includes('¿Qué equipos necesitas mantener funcionando?'));
  await act(async()=>findButton('Atrás').click());
  assert.equal(document.getElementById('quote-ciudad_otra').value,'Santiago, Nuevo León');
  await act(async()=>findButton('Atrás').click());await pick('Monterrey');
  assert.ok(!posts.at(-1).respuestas['Otra ciudad o municipio']);
  await start('comercial');await pick('Iluminación');assert.ok(document.querySelector('dialog[open]').textContent.includes('tu negocio'));await city();
  assert.ok(document.querySelector('dialog[open]').textContent.includes('¿Qué áreas necesitas iluminar?'));
  assert.equal(document.querySelector('dialog[open] textarea'),null);
  await check('Área de ventas o atención');await check('Oficinas');await check('Otro');await submitCurrent();
  assert.ok(document.querySelector('dialog[open]').textContent.includes('¿Qué otra área necesitas iluminar?'));
  assert.equal(findButton('Continuar').disabled,true);
  await fillDetail('Terraza de atención');
  assert.equal(posts.at(-1).respuestas['¿Qué áreas necesitas iluminar?'],'Área de ventas o atención; Oficinas; Otro');
  assert.equal(posts.at(-1).respuestas['¿Qué otra área necesitas iluminar?'],'Terraza de atención');
  await act(async()=>findButton('Atrás').click());
  assert.equal(document.querySelector('dialog[open] input[type=text]').value,'Terraza de atención');
  await act(async()=>findButton('Atrás').click());await check('Otro');await submitCurrent();
  assert.ok(document.querySelector('dialog[open]').textContent.includes('¿Qué necesitas para la iluminación?'));
  assert.ok(!posts.at(-1).respuestas['¿Qué otra área necesitas iluminar?']);
  await start('industrial');await pick('Iluminación');await city();
  await check('Nave o producción');await check('Andenes de carga');await submitCurrent();await pick('Otro');await fillDetail('Reubicar luminarias');
  assert.equal(posts.at(-1).respuestas['¿Qué más necesitas para la iluminación?'],'Reubicar luminarias');
  await start('comercial');await pick('Sistemas de respaldo');await pick('No');await city();
  await check('Refrigeración');await check('Otros equipos');await submitCurrent();await fillDetail('Equipo de sonido');
  assert.equal(posts.at(-1).respuestas['¿Qué otros equipos o procesos necesitas respaldar?'],'Equipo de sonido');
  await start('industrial');await pick('Estaciones de carga');assert.ok(document.querySelector('dialog[open]').textContent.includes('tu planta o nave'));await city();await check('Flotilla de la empresa');await check('Otro');await submitCurrent();await fillDetail('Proveedores');await pick('De 2 a 5 vehículos');
  assert.ok(document.querySelector('dialog[open]').textContent.includes('comentario adicional'));
  await act(async()=>findButton('Atrás').click());assert.ok(document.querySelector('dialog[open]').textContent.includes('¿Cuántos vehículos'));
  await act(async()=>reactRoot.unmount());
  dom.window.close();
  console.log('PASS: solar new/existing systems and monthly billing, mounted modal opens with interest, multiple equipment selection persists through Back and reaches booking without asking hours, lighting/charging routes and Back work. All requests mocked locally.');
}
integration().catch(error=>{console.error(error);process.exitCode=1;});

{
  const web=load(path.join(root,'src/lib/web-answers.ts'));
  const r={
    '¿Ya tienes paneles solares?':'Sí',
    '¿Qué necesitas para tu sistema actual?':'Otro',
    '¿Qué necesitas hacer con tu sistema de paneles?':'Mover paneles',
    '¿Qué equipos o procesos necesitas respaldar?':'Refrigeración; Otros equipos',
    '¿Qué otros equipos o procesos necesitas respaldar?':'Compresor',
    '¿Qué áreas necesitas iluminar?':'Oficinas; Otro',
    '¿Qué otra área necesitas iluminar?':'Azotea',
    '¿Qué necesitas para la iluminación?':'Renovar la iluminación actual',
    '¿Quién usará las estaciones de carga?':'Flotilla de la empresa',
    '¿Cuántos vehículos necesitas cargar al mismo tiempo?':'De 2 a 5 vehículos',
  };
  const f=web.answerFields(r,'$5,000 a $15,000');
  assert.equal(f.x_web_tiene_paneles,'si');
  assert.equal(f.x_web_sistema_actual,'otro');
  assert.equal(f.x_web_sistema_actual_otro,'Mover paneles');
  assert.equal(f.x_web_equipos,'Refrigeración; Otros equipos; Otro: Compresor');
  assert.equal(f.x_web_areas_iluminar,'Oficinas; Otro; Otro: Azotea');
  assert.equal(f.x_web_necesidad_iluminacion,'renovar');
  assert.equal(f.x_web_uso_cargadores,'Flotilla de la empresa');
  assert.equal(f.x_web_vehiculos,'2_5');
  assert.equal(f.x_web_periodo_recibo,'mensual');
  assert.deepEqual(web.answerFields({},''),{});
  assert.equal(web.periodoRecibo('Entre 0 y 3,000 pesos'),'bimestral');
  assert.equal(web.periodoRecibo('Menos de $50,000'),'mensual');
  assert.equal(web.periodoRecibo('$2,000 a $6,000 al bimestre'),'bimestral');
  assert.equal(web.periodoRecibo('Pago más de $15,000 al mes'),'mensual');
  assert.equal(web.periodoRecibo('No lo sé'),'');
  assert.equal(web.formularioFor('salida',false),'salida');
  assert.equal(web.formularioFor('hack',true),'contacto');
  assert.equal(web.formularioFor('',false),'');
  const t=web.trackingFields({atribucion:{gclid:'g'.repeat(300),utm_campaign:'Solar',landing:'https://lukx.com.mx/lp/residencial?x=1',referrer:''},utm_source:'google'});
  assert.equal(t.fields.x_web_gclid.length,250);
  assert.equal(t.fields.x_web_utm_source,'google');
  assert.equal(t.utmCampaign,'Solar');
  assert.equal(Object.hasOwn(t.fields,'x_web_referrer'),false);
  assert.equal(web.textToHtml('Hola <b>\nlínea & 2\n'),'<p>Hola &lt;b&gt;<br>línea &amp; 2</p>');
  // all selection keys match those created in Odoo
  const keys={x_web_tiene_paneles:['si','no'],x_web_sistema_actual:['ampliar','revisar','asesoria','otro'],x_web_necesidad_iluminacion:['nueva','renovar','asesoria','otro'],x_web_vehiculos:['1','2_5','mas_5','no_se'],x_web_periodo_recibo:['bimestral','mensual']};
  for(const sector of ['residencial','comercial','industrial','asesoria']) for(const space of ['','Mi casa','Mi negocio','Mi planta o nave']) {
    const base={...empty(),espacio:space};
    for(const interest of flow.getQuoteQuestions(sector,base)[0].options) {
      const answers={...base,interes:interest,tiene_paneles:'Sí'};
      for(const q of flow.getQuoteQuestions(sector,answers)) for(const option of q.options??[]) {
        const fields=web.answerFields(flow.quoteResponses(sector,{...answers,[q.id]:option},''),q.id==='recibo'?option:'');
        for(const [field,allowed] of Object.entries(keys)) if(fields[field]!==undefined) assert.ok(allowed.includes(fields[field]),`${field}=${fields[field]}`);
        if(['tiene_paneles','objetivo_solar','proyecto_iluminacion','cantidad_carga'].includes(q.id)) assert.ok(Object.keys(fields).length>0,`${q.id}/${option} unmapped`);
        if(q.id==='recibo' && option!=='No lo sé') assert.ok(fields.x_web_periodo_recibo,`periodo for ${option}`);
      }
    }
  }
  const {testLeadValues:lv}=load(path.join(root,'src/lib/odoo.ts'));
  const base={name:'Prueba',email:'prueba@example.invalid',whatsapp:'5512345678',pendingFields:{}};
  const noComment=lv({...base,comment:'',webFields:{x_web_formulario:'salida',x_web_equipos:false,x_studio_x:'nope'}},null,new Date(),[],false);
  assert.equal(Object.hasOwn(noComment,'description'),false);
  assert.equal(noComment.x_web_formulario,'salida');
  assert.equal(noComment.x_web_equipos,false);
  assert.equal(Object.hasOwn(noComment,'x_studio_x'),false);
  const withComment=lv({...base,comment:'Línea 1\nLínea <2>'},null,new Date(),[],false);
  assert.equal(withComment.description,'<p>Línea 1<br>Línea &lt;2&gt;</p>');
  assert.equal(withComment.x_studio_mensaje_del_lead,'Línea 1\nLínea <2>');
  const {testCustomFallbacks:cf}=load(path.join(root,'src/lib/odoo.ts'));
  const steps=cf({name:'a',x_studio_sector:'Residencial',x_web_formulario:'cotizador'});
  assert.deepEqual(steps,[{name:'a',x_studio_sector:'Residencial'},{name:'a'}]);
  assert.deepEqual(cf({name:'a',x_studio_sector:'Residencial'}),[{name:'a'}]);
  assert.deepEqual(cf({name:'a'}),[]);
  const o=web.leadOrigin;
  assert.equal(o({}),'organico');
  assert.equal(o({gclid:'abc'}),'google_ads');
  assert.equal(o({gbraid:'x'}),'google_ads');
  assert.equal(o({wbraid:'x',utm_source:'chatgpt',utm_medium:'cpc'}),'google_ads');
  assert.equal(o({utm_source:'Google',utm_medium:'CPC'}),'google_ads');
  assert.equal(o({utm_source:'adwords',utm_medium:'paid-search'}),'google_ads');
  assert.equal(o({utm_source:'google',utm_medium:'organic'}),'organico');
  assert.equal(o({utm_source:'google'}),'organico');
  assert.equal(o({utm_source:'chatgpt',utm_medium:'paid'}),'chatgpt_ads');
  assert.equal(o({utm_source:'OpenAI',utm_medium:'ads'}),'chatgpt_ads');
  assert.equal(o({utm_source:'chatgpt.com'}),'organico');
  assert.equal(o({utm_source:'chatgpt.com',utm_medium:'referral'}),'organico');
  assert.equal(o({utm_source:'facebook',utm_medium:'paid'}),'organico');
  const a=web.anuncioFor;
  assert.equal(a('Solar_Residencial_v2','Industrial'),'Residencial');
  assert.equal(a('ANUNCIO-COMERCIAL',''),'Comercial');
  assert.equal(a('respaldo industrial','Residencial'),'Industrial');
  assert.equal(a('Residéncial',''),'Residencial');
  assert.equal(a('video-etapas','Comercial'),'Comercial');
  assert.equal(a('',''),'');
  assert.equal(a('video','Otro'),'');
  assert.deepEqual(web.attributionOf({atribucion:{utm_source:'google',gclid:''},gclid:'body'}).gclid,'body');
  console.log('PASS: origin (Orgánico/Google Ads/ChatGPT Ads) and anuncio mapping, x_web_* mapping matches Odoo selection keys, tracking trimmed, empty comment keeps description, HTML-escaped line breaks.');
}
