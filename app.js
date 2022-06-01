const chaveAPI = '30ee27cf65ba91b18f740b1e';
const selectEsquerdo = document.querySelector('[data-js="currency-one"]');
const selectDireito = document.querySelector('[data-js="currency-two"]');
const quantidadeMoeda = document.querySelector('[data-js="currency-one-times"]');
const resultadoConversao = document.querySelector('[data-js="converted-value"]');
const resultadoConversaoBruta = document.querySelector('[data-js="conversion-precision"]');

let valorSelectEsquerdo = null;
let valorSelectDireito = null;
let nomeSelectEsquerdo = null;
let nomeSelectDireito = null;

async function obterMoedas() {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${chaveAPI}/latest/USD`);

    if (!response.ok) {
      throw new Error('Não foi possível obter os dados da API.');
    };

    return response.json();
  }
  catch (error) {
    console.log(error.message)
  }
};

function preencherSelect(select, nomeMoedas, valorMoedas, moedaPadrao) {
  nomeMoedas.forEach((moeda, index) => {
    moeda === moedaPadrao 
      ? select.innerHTML += `<option value="${valorMoedas[index]}" selected>${moeda}</option>` 
      : select.innerHTML += `<option value="${valorMoedas[index]}">${moeda}</option>`
  });
};

function obterValorPadraoMoeda(select) {
  return select.options[select.selectedIndex].value
};

function obterNomePadraoMoeda(select) {
  return select.options[select.selectedIndex].text
};

function obterValorMoeda(event) {
  const quantidadeMoedaParaConversao = quantidadeMoeda.value;

  valorSelectDireito = obterValorPadraoMoeda(selectDireito);
  valorSelectEsquerdo = obterValorPadraoMoeda(selectEsquerdo);
  nomeSelectDireito = obterNomePadraoMoeda(selectDireito);
  nomeSelectEsquerdo = obterNomePadraoMoeda(selectEsquerdo);

  if (event.target === selectEsquerdo) {
    valorSelectEsquerdo = event.target.options[event.target.selectedIndex].value;
    nomeSelectEsquerdo = event.target.options[event.target.selectedIndex].text;
  }
  
  if (event.target === selectDireito) {
    valorSelectDireito = event.target.options[event.target.selectedIndex].value;
    nomeSelectDireito = event.target.options[event.target.selectedIndex].text;
  }
  
  converterMoedas(valorSelectEsquerdo, valorSelectDireito, nomeSelectEsquerdo, nomeSelectDireito, quantidadeMoedaParaConversao);
};

function converterMoedas(valorOptionUm, valorOptionDois, nomeMoedaOptionUm, nomeMoedaOptionDois, quantidadeMoedaParaConversao) {
  const valorBruto = (valorOptionUm * valorOptionDois).toFixed(2);
  const valorConversao = (valorBruto * quantidadeMoedaParaConversao).toFixed(2);
  resultadoConversaoBruta.innerHTML = `1 ${nomeMoedaOptionUm} = ${valorBruto} ${nomeMoedaOptionDois}`;
  resultadoConversao.innerHTML = valorConversao;
};

async function obterDadosMoedas() {
  const retornoApi = await obterMoedas();
  
  const arrayMoedas = Object.entries(retornoApi.conversion_rates);
  const nomeMoedas = arrayMoedas.map(nomeMoeda => nomeMoeda[0]);
  const valorMoedas = arrayMoedas.map(valorMoeda => valorMoeda[1]);

  preencherSelect(selectEsquerdo, nomeMoedas, valorMoedas,'USD');
  preencherSelect(selectDireito, nomeMoedas, valorMoedas, 'BRL');

  const valorPadraoSelectDireito = obterValorPadraoMoeda(selectDireito);
  const valorPadraoSelectEsquerdo = obterValorPadraoMoeda(selectEsquerdo);
  const nomePadraoSelectDireito =  obterNomePadraoMoeda(selectDireito);
  const nomePadraoSelectEsquerdo =  obterNomePadraoMoeda(selectEsquerdo);
  const quantidadePadraoMoedaParaConversao = 1;

  converterMoedas(valorPadraoSelectEsquerdo, valorPadraoSelectDireito, nomePadraoSelectEsquerdo, nomePadraoSelectDireito, quantidadePadraoMoedaParaConversao);
};

selectEsquerdo.addEventListener('input', obterValorMoeda);
selectDireito.addEventListener('input', obterValorMoeda);
quantidadeMoeda.addEventListener('input', obterValorMoeda);

obterDadosMoedas();
