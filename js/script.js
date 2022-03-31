const $contain2 = $('.container-b')
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
const search = document.getElementById("from-currency")
const matchLista = document.getElementById("match-list-a")
const matchListb = document.getElementById("match-list-b")
const code = document.querySelector("text-primary")
const tosearch = document.getElementById("to-currency")
const $time = $('#time')

const history = JSON.parse(localStorage.getItem("history")) || []

const loadList = ()=>{
  history.forEach((element,index)=>{
      const historyId = index;
      $.ajax(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${element.from}&to_currency=${element.to}&apikey=${API}`)
      .then ((data)=>{
        const $li = $(`<li id="${historyId}" data-array="${historyId}" class="card-group">`)
        $li.html(`<button id=${historyId} class="delete" onclick="remove($('#${historyId}'))"> X </button>
        <div class="card-header">${data["Realtime Currency Exchange Rate"]["1. From_Currency Code"]}</div> <div class="card-body"><h4 class="card-title">
        ${data["Realtime Currency Exchange Rate"]["2. From_Currency Name"]}</h4>
        <p class="card-text">${data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]} <br>
        ${data["Realtime Currency Exchange Rate"]["3. To_Currency Code"]}</p>`)
        $history.append($li)
      }).catch(()=>{
        const $li = $(`<li id="${historyId}" data-array="${historyId}" class="card-group">`)
        $li.html(`<div class="card-header">Error</div> <div class="card-body"><h4 class="card-title"></h4>
        <p class="card-text">Loading Error<br>Try Again Later</p>`)
        $history.append($li)
    })
    })}



const filterDataA = async searchText => {
    const res = await fetch ("./js/currency_list.json")
    const currencyData = await res.json();
    let matches = currencyData.filter(currency =>{
        const regex = new RegExp(`^${searchText}`, 'gi')
        return currency.name.match(regex) || currency.code.match(regex);
    })
    if (searchText.length === 0) {
        matches = [];
        matchLista.innerHTML = ""
    }
    outputHtmlA (matches);
}
const filterDataB = async searchText => {
  const res = await fetch ("./js/currency_list.json")
  const currencyData = await res.json();
  let matches = currencyData.filter(currency =>{
      const regex = new RegExp(`^${searchText}`, 'gi')
      return currency.name.match(regex) || currency.code.match(regex);
  })
  if (searchText.length === 0) {
      matches = [];
      matchListb.innerHTML = ""
  }
  outputHtmlB (matches);
}


const outputHtmlA = matches => {
    if(matches.length>0){
        const html = matches.map(match =>`
        <div class="match"id=${match.code}><h5>${match.code}</h5> <p>${match.name}</p></div>
        `)
        .join('')
        matchLista.innerHTML = html
    }
}
const outputHtmlB = matches => {
  if(matches.length>0){
      const html = matches.map(match =>`
      <div class="match"id=${match.code}><h5>${match.code}</h5> <p>${match.name}</p></div>
      `)
      .join('')
      matchListb.innerHTML = html
  }
}

search.addEventListener('input', ()=> filterDataA (search.value))
tosearch.addEventListener('input', ()=> filterDataB (tosearch.value))

matchLista.addEventListener('click', (event)=>{
  search.value = `${event.target.parentElement.id}`
  matches = [];
  matchLista.innerHTML = ""
})
matchListb.addEventListener('click', (event)=>{
  tosearch.value = `${event.target.parentElement.id}`
  matches = [];
  matchListb.innerHTML = ""
})
    

$fromSearch.on("keyup",(event) =>{
  if (event.keyCode === 13) {
  $cButton.click();
  }
});
$toSearch.on("keyup",(event) =>{
  if (event.keyCode === 13) {
  $cButton.click();
  }
})

$cButton.on('click', (event)=>{
  event.preventDefault()
  matchListb.innerHTML = ""
  matchLista.innerHTML = ""
  const from = $fromSearch.val()
  const to = $toSearch.val()
  $.ajax(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API}`)
  .then ((data)=>{
      $fromValue.text(`1 ${data["Realtime Currency Exchange Rate"]["2. From_Currency Name"]} (${data["Realtime Currency Exchange Rate"]["1. From_Currency Code"]}) ` + '=')
      $exchangeValue.text(`${data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]} `) 
      $toValue.text(`${data["Realtime Currency Exchange Rate"]["4. To_Currency Name"]} (${data["Realtime Currency Exchange Rate"]["3. To_Currency Code"]})`)
      $three.show()
  }).catch(()=>{
    $fromValue.text(`invalid or Loading Error`)
  })
  })

$sButton.on('click',(event)=>{
  event.preventDefault()
  const from = $fromSearch.val()
  const to = $toSearch.val()
  addHistory(from,to)
  localStorage.setItem("history",JSON.stringify(history) )
  location.reload()
})

$history.on('click',(event)=>{
  history.splice(event.target.id, 1)
  localStorage.setItem("history",JSON.stringify(history) )
})

function remove(el) {
  const element = el;
  element.remove();
}

const addHistory = (from,to)=>{
  history.push({
    from,
    to,
    })
  }

$three.hide()
loadList()


const date = new Date();
const n = date.toDateString();
const time = date.toLocaleTimeString();
$time.text(`Exchange rate as of ${n} - ${time}`)
