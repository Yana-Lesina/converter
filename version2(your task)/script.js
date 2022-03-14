
const dateMsg = document.getElementById('date'); //div с сообщением о последнем обновлении 
const fromInputs = document.querySelector('.row-from'); //для навешивания прослушивания события изменения input и select
const fromNum = fromInputs.querySelector('.convertFrom-input'); //input
const fromCurrency = fromInputs.querySelector('.convertFrom-select'); //select

//объект, хранящий курсы валют (добавляются динамически при чтении файла)
const Currencies = {
  // для получения курса использовалась API российского банка, курс в объекте идёт относительно рубля
  //так как берем все значения от российского рубля:
  RUB: 1, 
}


const createDate = (data) => {
  const date = new Date(data);
  dateMsg.textContent = `Last updated: ${date.toString()}`;
}

//получение курса валют из файла
const getCurrencies = async () => {
  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  const jsonData = await response.json();
  const result = await jsonData;

  Currencies.BYN = result.Valute.BYN.Value;
  Currencies.USD = result.Valute.USD.Value;
  Currencies.EUR = result.Valute.EUR.Value;
  Currencies.CNY = result.Valute.CNY.Value; 

  createDate(result.Timestamp);//обновление даты 
}

getCurrencies();

//алгоримт: 
//в memory записана выбранная пользователем валюта (по умолчанию в верстке стоит BYN, поэтому и здесь по умолчанию - BYN)
//если изменяется select, ищем среди правосторонних валют ту, которую выбрал пользователь
//находим совпадение => на это место записываем валюту из memory, затем меняем значение memory на совпавшую валюту
//второй цикл по псевдомассиву currencyElems переводит выбранную валюту в 4 варианта 
//смысл формулы: выбранную валюту переводим в рубли(так как курс относительно рубля), из рублей - в остальные 4

let memory = 'BYN'; 
const currencyElems = document.querySelectorAll('.currence-elem');//всевдомассив из элементов div(input + span)

fromInputs.addEventListener('input', (e) => {
  getCurrencies(); //обновление данных курса

  if(e.target.classList.contains('convertFrom-select')) {
    currencyElems.forEach((item, id) => {
      if(item.childNodes[2].textContent === fromCurrency.value) {
        console.log('!!!!' + fromCurrency.value + id)
        item.childNodes[2].textContent = memory;
        memory = fromCurrency.value;
      }
    })
  }

  currencyElems.forEach((item) => {
    item.childNodes[1].value = (fromNum.value*Currencies[fromCurrency.value]/Currencies[item.childNodes[2].textContent]).toFixed(2);
  })
  
})

