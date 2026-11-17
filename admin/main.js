(async()=>{
  try {
    const paths = [0,1,2,3,4].map(i => './parts/'+i+'.txt');
    const responses = await Promise.all(paths.map(path => fetch(path, {cache:'no-store'})));
    if(responses.some(r => !r.ok)) throw Error('Falha ao carregar arquivos do painel.');
    const source = (await Promise.all(responses.map(r => r.text()))).join('');
    const url = URL.createObjectURL(new Blob([source], {type:'text/javascript'}));
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => URL.revokeObjectURL(url);
    script.onerror = () => {URL.revokeObjectURL(url);throw Error('Falha ao iniciar painel administrativo.');};
    document.head.append(script);
  } catch(e) {
    const gate = document.getElementById('loading');
    if(gate) gate.textContent = 'Não foi possível carregar o painel: '+e.message;
  }
})();
