//*----- constants -----*/
const $one = $('#one')
const $two = $('#two')
const $three = $('#three')
const $sButton = $('#save')
const $cButton = $('#convert-button')
const $fromSearch = $('#from-currency')
const $toSearch = $('#to-currency')
const $fromValue = $('#from-value')
const $toValue = $('#to-value')
const $exchangeValue = $('#exchange-value')
const $history = $('#history')
const API = "UH9IHAC400APFIS3"
//const $textInput = $("[type='text']")


// ----FUNCTION-----
function remove(el) {
  const element = el;
  element.remove();
}

// $history.on("click",(e)=>{
//   if(e.target && e.target.classList.contains('delete')){
//     const name = e.target.dataset.name
//   }
// })




//add on to make the UX better
$fromSearch.on("keyup",(event) =>{
    if (event.keyCode === 13) {
     event.preventDefault();
     $cButton.click();
    }
  });

//add on to make the UX better
  $toSearch.on("keyup",(event) =>{
    if (event.keyCode === 13) {
     event.preventDefault();
     $cButton.click();

    }
  });


  $cButton.on('click', (event)=>{
    event.preventDefault()
    const from = $fromSearch.val()
    const to = $toSearch.val()
    $.ajax(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API}`)
    .then ((data)=>{
        $fromValue.text(`1 ${data["Realtime Currency Exchange Rate"]["2. From_Currency Name"]} (${data["Realtime Currency Exchange Rate"]["1. From_Currency Code"]}) ` + '=')
        $exchangeValue.text(`${data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]} `) 
        $toValue.text(`${data["Realtime Currency Exchange Rate"]["4. To_Currency Name"]} (${data["Realtime Currency Exchange Rate"]["3. To_Currency Code"]})`)
  })
  })

  $sButton.on('click',(event)=>{
    event.preventDefault()
    const from = $fromSearch.val()
    const to = $toSearch.val()
    $.ajax(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API}`)
    .then ((data)=>{
      const $li = $(`<li id="${from}-${to}" class="r-list">`)
      $li.html(`${data["Realtime Currency Exchange Rate"]["2. From_Currency Name"]} ${data["Realtime Currency Exchange Rate"]["1. From_Currency Code"]}
      <br> <br> ${data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]} 
      ${data["Realtime Currency Exchange Rate"]["3. To_Currency Code"]}<br> <button class="delete" " onclick="remove($('#${from}-${to}'))">Remove</button>`)
      $history.append($li)
  })})

