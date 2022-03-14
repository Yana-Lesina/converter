const calc = document.querySelector('.calc-wrapper'); //получен для делегирования
const fromNum = document.getElementById('savings'); //input левосторонний
const fromCurrency = document.getElementById('from-currency');//select левосторонний
const toNum = document.getElementById('desire');//input правосторонний
const toCurrency = document.getElementById('to-currency');//select правосторонний
const btn = document.querySelector('.transfer-container'); 
const dateMsg = document.getElementById('date');


const Currencies = {
  // для получения курса использовалась API российского банка, курс в объекте идёт относительно рубля
  //так как берем все значения от российского рубля:
  RUB: 1, 
};

const createDate = (data) => {
  const date = new Date(data);
  dateMsg.textContent =`Last updated: ${date.toString()}`;
}

const getCurrencies = async () => {
  const responce = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  const jsonData = await responce.json();
  const result = await jsonData;

  Currencies.BYN = result.Valute.BYN.Value;
  Currencies.USD = result.Valute.USD.Value;
  Currencies.EUR = result.Valute.EUR.Value;
  Currencies.CNY = result.Valute.CNY.Value; 

  createDate(result.Timestamp);//обновление даты 
}

getCurrencies();

calc.addEventListener('input', (e) => {
  getCurrencies(); //обновление данных курса

  //если пользователем изменяется левосторонний селект/инпут или правосторонний селект, то меняем инпут справа
  if (e.target.classList.contains('convert')) {
    toNum.value = (fromNum.value*Currencies[fromCurrency.value]/Currencies[toCurrency.value]).toFixed(2)
    //такой же принцип формулы, как и в version2
  
  //на случай, если  п-ль пытается подогнать цифру в левом инпуте с помощью правого
  } else if (e.target.classList.contains('change')) {
    fromNum.value = (toNum.value*Currencies[toCurrency.value]/Currencies[fromCurrency.value]).toFixed(2)
    //расчёт курса по правостороннему значению
  }
})

//меняем валюту местами
btn.addEventListener('click', () => {
  let currMemory = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = currMemory;

  toNum.value = (fromNum.value*Currencies[fromCurrency.value]/Currencies[toCurrency.value]).toFixed(2);
})




