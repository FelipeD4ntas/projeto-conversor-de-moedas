const chaveAPI = '8d39dddd8c52cd3f6669826c'
const container = document.querySelector('[data-js="container"]');
const selectEsquerdo = document.querySelector('[data-js="currency-one"]');
const selectDireito = document.querySelector('[data-js="currency-two"]');
const quantidadeMoeda = document.querySelector('[data-js="currency-one-times"]');
const resultadoConversao = document.querySelector('[data-js="converted-value"]');
const resultadoConversaoBruta = document.querySelector('[data-js="conversion-precision"]');

let dadosMoedas = {};

function buscarURL(moeda) {
  return `https://v6.exchangerate-api.com/v6/${chaveAPI}/latest/${moeda}`;
}

function preencherSelects(dadosMoedas, moedaPadrao) {
  return Object.keys(dadosMoedas.conversion_rates)
    .map(moeda => `<option ${moeda === moedaPadrao ? 'selected' : ''}>${moeda}</option>`)
    .join('');
};

function exibirSelectsPreenchidos() {
  selectEsquerdo.innerHTML = preencherSelects(dadosMoedas, 'USD');
  selectDireito.innerHTML = preencherSelects(dadosMoedas, 'BRL');
};

function exibirMoedasConvertidas() {
  const valorSelectDireito = dadosMoedas.conversion_rates[selectDireito.value];
  const cambioTotal = quantidadeMoeda.value * valorSelectDireito;

  resultadoConversao.innerText = (cambioTotal).toFixed(2);
  resultadoConversaoBruta.innerText = `1 ${selectEsquerdo.value} = ${1 * valorSelectDireito} ${selectDireito.value}`;
};

function dadosMoedaPadrao() {
  resultadoConversao.innerText = (1 * dadosMoedas.conversion_rates.BRL).toFixed(2);
  resultadoConversaoBruta.innerText = `1 USD = ${1 * dadosMoedas.conversion_rates.BRL} BRL`;
};

function buscarMensagemDeErro(tipoErro) {
  return {
    'unsuported-code': 'A moeda não existe em nosso banco de dados.',
    'base-code-only-on-pro': 'Informações de moedas que não sejam USD ou EUR só podem ser acessadas a parte.',
    'malformed-reques': 'O endpoint do seu request precisa seguir a estrutura a seguir: https://v6.exchangerate-api.com/v6/sua chave/latest/USD',
    'invalid-key': 'A chave API não é válida.',
    'quota-reached': 'Sua conta alcançou o limite de requests permitido em seu plano atual.',
    'not-available-on-plan': 'Seu plano atual não permite este tipo de request.'
  }[tipoErro] || 'Não foi possível obter as informações';
};

function alterarQuantidadeDeCambio(event) {
  const valorSelectDireito = dadosMoedas.conversion_rates[selectDireito.value];
  const quantidadeMoedasParaConversao = event.target.value;
  return resultadoConversao.innerText = (quantidadeMoedasParaConversao * valorSelectDireito).toFixed(2);
};

async function fazerRequest(url) {
  try {
    const response = await fetch(url);
    const objetoRetornado = await response.json();
    
    if (!response.ok) {
      throw new Error('Sua conexão falhou, não foi possível obter as informações.');
    };

    if (objetoRetornado.result === 'error') {
      throw new Error(buscarMensagemDeErro(objetoRetornado['error-type']));
    };

    return objetoRetornado;

  } catch(error) {
    alert(error.message);
    const div = document.createElement('div')
    const button = document.createElement('button');

    div.textContent = error.message;
    div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    button.classList.add('btn-close');
    div.setAttribute('role', 'alert');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Close');
    
    button.addEventListener('click', () => div.remove())

    div.appendChild(button);
    container.insertAdjacentElement('afterend', div);
  };

};

async function iniciarJS() {
  const dadosExternoMoedas = await fazerRequest(buscarURL('USD'));
  dadosMoedas = {...dadosExternoMoedas};
  
  exibirSelectsPreenchidos();
  dadosMoedaPadrao();
};

async function alterarMoedaPadraoDeCambio(event) {
  const dadosExternoMoedas = await fazerRequest(buscarURL(event.target.value));
  dadosMoedas = {...dadosExternoMoedas};

  exibirMoedasConvertidas();
}

quantidadeMoeda.addEventListener('input', alterarQuantidadeDeCambio);

selectDireito.addEventListener('input', exibirMoedasConvertidas);

selectEsquerdo.addEventListener('input', alterarMoedaPadraoDeCambio);

iniciarJS();