const allCryptoUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=102&page=1";
const moreInfoUrl = "https://api.coingecko.com/api/v3/coins/";
const LiveReport = "https://www.cryptocompare.com/api/%23-api-data-price"
let allCoins = [];
let myCoins = {};
let coinName = [];
const cache = {};

const createCoins = async (coins = allCoins) => {
  $(".loading-spinner").hide();
  const searchButton = () => {
    $("#searchButton").on("click", () => {
      const searchText = $("#searchText").val().toLowerCase();
      const filteredCoins = coins.filter((coin) => {
        return coin.symbol.toLowerCase().includes(searchText);
      });
      displayCoins(filteredCoins);
    });
  };
  const displayCoins = (coins) => {
    $("#container").empty();

    coins.forEach((coin) => {
      const card = $(`
        <div class="card col-md-4 border border-secondary rounded box">
          <div class="d-flex justify-content-between ">
            <p class="fs-5 bold">${coin.symbol.toUpperCase()}</p>
            <div class="form-check form-switch">
              <input class="form-check-input mt-2" type="checkbox" id="${coin.id}">
            </div>
          </div>
          <p>${coin.name}</p>
          <input type="button" value="more info" class="btn btn-primary col-5 mb-1 more-info-btn" data-coin-id="${coin.id}">
          <div class="more-info" style="display:none;"></div>
        </div>
      `);

      card.find(".more-info-btn").on("click", async function () {
        const moreInfoContainer = $(this).closest(".card").find(".more-info");
        if (moreInfoContainer.children().length === 0) {
          const coinId = $(this).data("coin-id");
          let moreInfo = cache[coinId];
          if (!moreInfo) {
            $(".loading-spinner").show();
            moreInfo = await $.get(`${moreInfoUrl}${coinId}`);
            cache[coinId] = moreInfo;
            $(".loading-spinner").hide();
          }
          moreInfoContainer.append(`
            <div class="info">
              <p>Price (USD): ${moreInfo.market_data.current_price.usd} $</p>
              <p>Price (ILS): ${moreInfo.market_data.current_price.ils} ₪</p>
              <p>Price (EUR): ${moreInfo.market_data.current_price.eur} €</p>
              <img src="${moreInfo.image.small}" alt="${moreInfo.name}" />
            </div>
          `);
        }
        moreInfoContainer.toggle();
      });

      card.find('input[type="checkbox"]').on("click", function () {
        if ($(this).prop("checked")) {
          if (coinName.length < 5) {
            coinName.push(coin);
          }
          else {
            modalBuilder();
            $('#myModal').modal('show');
            $(this).prop("checked", false)
          }
        }
      });

      $("#container").append(card);
    });
  };
  const modalBuilder = () => {
    let result = "";
    coinName.map((coin) => {
      result += `<div class="card col-md-8 border border-secondary rounded box" data-coin-id="${coin.id}">
          <div class="d-flex justify-content-between">
            <p class="fs-5 bold">${coin.symbol.toUpperCase()}</p>
            <div class="form-check form-switch">
              <input class="form-check-input mt-2" type="checkbox" checked data-coin-id="${coin.id}">
            </div>
          </div>
          <p>${coin.name}</p>
          <input type="button" value="more info" class="btn btn-primary col-10 mb-1 more-info-btn" data-coin-id="${coin.id}">
          <div class="more-info" style="display:none;"></div>
        </div>`;
    });
    $("#modalBody").html(result);
    $(".form-check-input").on("change", function () {
      const coinId = $(this).data("coin-id");
      const isChecked = $(this).prop("checked");
      $(`.card[data-coin-id=${coinId}] .form-check-input`).prop("checked", isChecked);
      if (!isChecked) {
        $(`.card[data-coin-id=${coinId}]`).remove();
      }});
  };
  searchButton();

  coins.forEach((coin) => {
    const card = $(`
    
      <div class="card col-md-4 border border-secondary rounded box">
        <div class="d-flex justify-content-between ">
          <p class="fs-5 bold">${coin.symbol.toUpperCase()}</p>
          <div class="form-check form-switch">
            <input class="form-check-input mt-2" type="checkbox" id="${coin.id}">
          </div>
        </div>
        <p>${coin.name}</p>
        <input type="button" value="more info" class="btn btn-primary col-5 mb-1 more-info-btn" data-coin-id="${coin.id}">
        <div class="more-info" style="display:none;"></div>
      </div>
    `);

    card.find(".more-info-btn").on("click", async function () {
      const moreInfoContainer = $(this).closest(".card").find(".more-info");
      if (moreInfoContainer.children().length === 0) {
        const coinId = $(this).data("coin-id");
        let moreInfo = cache[coinId];
        if (!moreInfo) {
          $(".loading-spinner").show();
          moreInfo = await $.get(`${moreInfoUrl}${coinId}`);
          cache[coinId] = moreInfo;
          $(".loading-spinner").hide();
        }
        moreInfoContainer.append(`
          <div class="info">
          <p>Price (USD): ${moreInfo.market_data.current_price.usd} $</p>
          <p>Price (ILS): ${moreInfo.market_data.current_price.ils} ₪</p>
          <p>Price (EUR): ${moreInfo.market_data.current_price.eur} €</p>
          <img src="${moreInfo.image.small}" alt="${moreInfo.name}" />
          </div>
        `);
      }
      moreInfoContainer.toggle();
    });

    $("#container").append(card);
    card.find('input[type="checkbox"]').on("click", function () {
      if ($(this).prop("checked")) {
        if (coinName.length < 5) {
          coinName.push(coin);
        }
        else {
          modalBuilder();
          $('#myModal').modal('show');
          $(this).prop("checked", false)
        }}
    });

    const modalBuilder = () => {
      let result = "";
      coinName.map((coin) => {
        result += `
          <div class="card col-md-8 border border-secondary rounded box" data-coin-id="${coin.id}">
            <div class="d-flex justify-content-between">
              <p class="fs-5 bold">${coin.symbol.toUpperCase()}</p>
              <div class="form-check form-switch">
                <input class="form-check-input mt-2" type="checkbox" checked data-coin-id="${coin.id}">
              </div>
            </div>
            <p>${coin.name}</p>
            <input type="button" value="more info" class="btn btn-primary col-10 mb-1 more-info-btn" data-coin-id="${coin.id}">
            <div class="more-info" style="display:none;"></div>
          </div> `;
      });
      $("#modalBody").html(result);
      $(".form-check-input").on("change", function () {
        const coinId = $(this).data("coin-id");
        const isChecked = $(this).prop("checked");
        $(`.card[data-coin-id=${coinId}] .form-check-input`).prop("checked", isChecked);
        if (!isChecked) {{
          const index = coinName.indexOf(coin.id);
          if(index >-1){
            coinName.splice(index,1);
            const checkbox = document.getElementById(coin.id);
            if(checkbox){
              checkbox.checked = false;
            }
          }
        }}
      });
    };
  });
};

const getAllCoins = async () => {
  if (cache.allCoins) {
    return cache.allCoins;
  }

  try {
    const coins = await $.get(allCryptoUrl);
    cache.allCoins = coins;
    return coins;
  } catch (error) {
    console.log(error);
  }
};

$(async () => {
  try {
    allCoins = await getAllCoins();
    createCoins();
  } catch (error) {
    console.log(error);
  }
});


window.onload = function () {
  var options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "coins "
    },
    subtitles: [{
      text: "Click Legend to Hide or Unhide Data Series"
    }],
    axisX: {
      title: "States"
    },
    axisY: {
      title: "Units Sold",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
    },
    axisY2: {
      title: "Profit in USD",
      titleFontColor: "#C0504E",
      lineColor: "#C0504E",
      labelFontColor: "#C0504E",
      tickColor: "#C0504E"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries
    },
    data: [{
      type: "spline",
      name: "Units Sold",
      showInLegend: true,
      xValueFormatString: "MMM YYYY",
      yValueFormatString: "#,##0 Units",
      dataPoints: [
        { x: new Date(2023, 0, 1), y: 120 },
        { x: new Date(2023, 1, 1), y: 135 },
        { x: new Date(2023, 2, 1), y: 144 },
        { x: new Date(2023, 3, 1), y: 103 },
        { x: new Date(2023, 4, 1), y: 93 },
        { x: new Date(2023, 5, 1), y: 129 },
        { x: new Date(2023, 6, 1), y: 143 },
        { x: new Date(2023, 7, 1), y: 156 },
        { x: new Date(2023, 8, 1), y: 122 },
        { x: new Date(2023, 9, 1), y: 106 },
        { x: new Date(2023, 10, 1), y: 137 },
        { x: new Date(2023, 11, 1), y: 142 }
      ]
    },
    {
      type: "spline",
      name: "Profit",
      axisYType: "secondary",
      showInLegend: true,
      xValueFormatString: "MMM YYYY",
      yValueFormatString: "$#,##0.#",
      dataPoints: [
        { x: new Date(2023, 0, 1), y: 19034.5 },
        { x: new Date(2023, 1, 1), y: 20015 },
        { x: new Date(2023, 2, 1), y: 27342 },
        { x: new Date(2023, 3, 1), y: 20088 },
        { x: new Date(2023, 4, 1), y: 20234 },
        { x: new Date(2023, 5, 1), y: 29034 },
        { x: new Date(2023, 6, 1), y: 30487 },
        { x: new Date(2023, 7, 1), y: 32523 },
        { x: new Date(2023, 8, 1), y: 20234 },
        { x: new Date(2023, 9, 1), y: 27234 },
        { x: new Date(2023, 10, 1), y: 33548 },
        { x: new Date(2023, 11, 1), y: 32534 }
      ]
    }]
  };
  $("#chartContainer").CanvasJSChart(options);

  function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }
}