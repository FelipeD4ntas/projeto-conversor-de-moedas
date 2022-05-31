/*
  07

  - No index.html, comente a div com a classe "container" que contém a tabela;
  - Descomente: 
    - A <div> com a classe "container" abaixo da div que você acabou de 
      comentar;
    - A <link> que importa o style.css;
  - Construa uma aplicação de conversão de moedas. O HTML e CSS são os que 
    você está vendo no browser (após salvar os arquivos);
  - Você poderá modificar a marcação e estilos da aplicação depois. No momento, 
    concentre-se em executar o que descreverei abaixo;
    - Quando a página for carregada: 
      - Popule os <select> com tags <option> que contém as moedas que podem ser
        convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para 
        dollar dos Estados Unidos, etc.
      - O option selecionado por padrão no 1º <select> deve ser "USD" e o option
        no 2º <select> deve ser "BRL";
      - O parágrafo com data-js="converted-value" deve exibir o resultado da 
        conversão de 1 USD para 1 BRL;
      - Quando um novo número for inserido no input com 
        data-js="currency-one-times", o parágrafo do item acima deve atualizar 
        seu valor;
      - O parágrafo com data-js="conversion-precision" deve conter a conversão 
        apenas x1. Exemplo: 1 USD = 5.0615 BRL;
      - O conteúdo do parágrafo do item acima deve ser atualizado à cada 
        mudança nos selects;
      - O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
        cada mudança nos selects e/ou no input com data-js="currency-one-times";
      - Para que o valor contido no parágrafo do item acima não tenha mais de 
        dois dígitos após o ponto, você pode usar o método toFixed: 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    - Para obter as moedas com os valores já convertidos, use a Exchange rate 
      API: https://www.exchangerate-api.com/;
      - Para obter a key e fazer requests, você terá que fazer login e escolher
        o plano free. Seus dados de cartão de crédito não serão solicitados.
  
  PS: o desafio aqui é você implementar essa aplicação sozinho(a) e enviá-la 
  para análise antes de ver as próximas aulas, ok? =)
*/


const chaveAPI = '30ee27cf65ba91b18f740b1e';
const selectEsquerdo = document.querySelector('[data-js="currency-one"]');
const selectDireito = document.querySelector('[data-js="currency-two"]');
const resultadoConversao = document.querySelector('[data-js="converted-value]');


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
  })
}

function converterMoedas(event) {
 console.log(event.target.options[event.target.selectedIndex].value);
};

async function obterDadosMoedas() {
  const retornoApi = await obterMoedas();
  
  const arrayMoedas = Object.entries(retornoApi.conversion_rates);
  const nomeMoedas = arrayMoedas.map(nomeMoeda => nomeMoeda[0]);
  const valorMoedas = arrayMoedas.map(valorMoeda => valorMoeda[1]);

  preencherSelect(selectEsquerdo, nomeMoedas, valorMoedas,'USD');
  preencherSelect(selectDireito, nomeMoedas, valorMoedas, 'BRL');
}

selectDireito.addEventListener('input', converterMoedas);
selectEsquerdo.addEventListener('input', converterMoedas);

obterDadosMoedas()
