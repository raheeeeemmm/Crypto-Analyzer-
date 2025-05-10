
function trackLivePrice() {
  const coinSymbol = document.getElementById('live-coin-symbol').value.toLowerCase();
  const apiUrl = `https://api.coingecko.com/api/v3/coins/list`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const coin = data.find(c => c.symbol === coinSymbol);
      if (coin) {
        const coinId = coin.id;
        const priceApiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

        fetch(priceApiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            const price = data[coinId]?.usd;
            if (price) {
              document.getElementById('live-price-result').innerHTML = `<strong>Current price of ${coinSymbol.toUpperCase()}: $${price.toFixed(2)}</strong>`;
            } else {
              document.getElementById('live-price-result').textContent = 'Price data unavailable for the specified coin.';
            }
          })
          .catch(error => {
            console.log(error);
            document.getElementById('live-price-result').textContent = 'Error fetching live price. Please try again later.';
          });
      } else {
        document.getElementById('live-price-result').textContent = 'Coin not found.';
      }
    })
    .catch(error => {
      console.log(error);
      document.getElementById('live-price-result').textContent = 'Error fetching coin data. Please try again later.';
    });
}

  function getHistoricalData() {
    const coinSymbol = document.getElementById('historical-coin-symbol').value.toLowerCase();
    const coinIdUrl = `https://api.coingecko.com/api/v3/coins/list`;
  
    fetch(coinIdUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const coin = data.find(c => c.symbol === coinSymbol);
        if (coin) {
          const coinId = coin.id;
          const historicalDataUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=10`;
  
          fetch(historicalDataUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              const prices = data.prices;
              const timestamps = prices.map(price => new Date(price[0]).toLocaleDateString());
              const coinPrices = prices.map(price => price[1]);
  
              const chartElement = document.getElementById('historical-chart');
              chartElement.innerHTML = ''; // Clear previous chart
              const canvas = document.createElement('canvas');
              chartElement.appendChild(canvas);
  
              const ctx = canvas.getContext('2d');
              new Chart(ctx, {
                type: 'line',
                data: {
                  labels: timestamps,
                  datasets: [
                    {
                      label: `${coinSymbol.toUpperCase()} Price`,
                      data: coinPrices,
                      borderColor: 'blue',
                      fill: false
                    }
                  ]
                },
                options: {
                  responsive: true,
                  scales: {
                    x: {
                      ticks: {
                        maxTicksLimit: 6
                      }
                    }
                  }
                }
              });
            })
            .catch(error => {
              console.log(error);
              document.getElementById('historical-chart').textContent = 'Error fetching historical data.';
            });
        } else {
          document.getElementById('historical-chart').textContent = 'Coin not found.';
        }
      })
      .catch(error => {
        console.log(error);
        document.getElementById('historical-chart').textContent = 'Error fetching coin data. Please try again later.';
      });
  }


function compareCoins() {
  const coin1Symbol = document.getElementById('coin1-symbol').value.toLowerCase();
  const coin2Symbol = document.getElementById('coin2-symbol').value.toLowerCase();
  const coinIdUrl = `https://api.coingecko.com/api/v3/coins/list`;

  fetch(coinIdUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const coin1 = data.find(c => c.symbol === coin1Symbol);
      const coin2 = data.find(c => c.symbol === coin2Symbol);

      if (coin1 && coin2) {
        const coin1Id = coin1.id;
        const coin2Id = coin2.id;

        const historicalDataUrl = `https://api.coingecko.com/api/v3/coins/${coin1Id}/market_chart?vs_currency=usd&days=30`;
        const historicalDataUrl2 = `https://api.coingecko.com/api/v3/coins/${coin2Id}/market_chart?vs_currency=usd&days=30`;

        Promise.all([fetch(historicalDataUrl), fetch(historicalDataUrl2)])
          .then(responses => Promise.all(responses.map(response => response.json())))
          .then(data => {
            const coin1Prices = data[0].prices;
            const coin2Prices = data[1].prices;
            const timestamps = coin1Prices.map(price => new Date(price[0]).toLocaleDateString());

            const chartElement = document.getElementById('compare-chart');
            chartElement.innerHTML = ''; // Clear previous chart
            const canvas = document.createElement('canvas');
            chartElement.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: timestamps,
                datasets: [
                  {
                    label: `${coin1Symbol.toUpperCase()} Price`,
                    data: coin1Prices.map(price => price[1]),
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)', // Set the background color
                    fill: 'origin', // Fill the area under the line
                  },
                  {
                    label: `${coin2Symbol.toUpperCase()} Price`,
                    data: coin2Prices.map(price => price[1]),
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.2)', // Set the background color
                    fill: 'origin', // Fill the area under the line
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  x: {
                    ticks: {
                      maxTicksLimit: 6,
                    },
                    grid: {
                      display: false, // Hide the x-axis grid lines
                    },
                  },
                  y: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)', // Customize the color of y-axis grid lines
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top', // Position the legend at the top
                  },
                  tooltip: {
                    mode: 'index', // Show tooltips for each dataset point
                  },
                },
              },
            });
          })
          .catch(error => {
            console.log(error);
            document.getElementById('compare-chart').textContent = 'Error fetching historical data.';
          });
      } else {
        document.getElementById('compare-chart').textContent = 'Coin not found.';
      }
    })
    .catch(error => {
      console.log(error);
      document.getElementById('compare-chart').textContent = 'Error fetching coin data. Please try again later.';
    });
}

function sortCoins() {
  const numCoins = document.getElementById('num-coins').value;
  const apiUrl = 'coins.json';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const coins = getRandomCoins(data.cryptocurrencies, numCoins);

      const sortedCoinsMerge = mergeSort(coins);
      const sortedCoinsQuick = quickSort(coins);

      const sortedCoinsElement = document.getElementById('sorted-coins');
      sortedCoinsElement.innerHTML = ''; // Clear previous content

      const mergeSortElement = document.createElement('div');
      mergeSortElement.innerHTML = `<h3>Merge Sort:</h3><p>Sorted coins based on market worth:</p>${getCoinList(sortedCoinsMerge)}`;
      sortedCoinsElement.appendChild(mergeSortElement);

      const quickSortElement = document.createElement('div');
      quickSortElement.innerHTML = `<h3>Quick Sort:</h3><p>Sorted coins based on market worth:</p>${getCoinList(sortedCoinsQuick)}`;
      sortedCoinsElement.appendChild(quickSortElement);

      const timeComplexityElement = document.getElementById('time-complexity');
      timeComplexityElement.innerHTML = `<p>Merge Sort Time Complexity: ${getCaseType('mergeSort', numCoins)}</p>` +
        `<p>Quick Sort Time Complexity:  ${getCaseType('quickSort', numCoins)}</p>`;
    })
    .catch(error => {
      console.log(error);
      document.getElementById('sorted-coins').textContent = 'Error sorting coins.';
    });
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const merged = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i].market_cap < right[j].market_cap) {
      merged.push(left[i]);
      i++;
    } else {
      merged.push(right[j]);
      j++;
    }
  }

  return merged.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  const less = [];
  const equal = [];
  const greater = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].market_cap < pivot.market_cap) {
      less.push(arr[i]);
    } else if (arr[i].market_cap > pivot.market_cap) {
      greater.push(arr[i]);
    } else {
      equal.push(arr[i]);
    }
  }
function isReversed(arrLength) {
  // Function to check if the array is in reverse order
  for (let i = 0; i < arrLength - 1; i++) {
    if (arr[i] <= arr[i + 1]) {
      return false;
    }
  }
  return true;
}
function isSorted(arr) {
  // Function to check if the array is already sorted
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}


  if (arr.length == 2 && less.length == 1 && greater.length == 1) {
    // In the worst case scenario for an array of length 2
    return [...quickSort(greater), ...equal, ...quickSort(less)];
  }

  return [...quickSort(less), ...equal, ...quickSort(greater)];
}


fetch('coins.json')
  .then(response => response.json())
  .then(data => {
    const numCoins = 5;
    const coins = getRandomCoins(data.cryptocurrencies, numCoins);
    const sortedCoinsMerge = mergeSort(coins);
    const sortedCoinsQuick = quickSort(coins);

    console.log("Merge Sort:");
    console.log("Sorted coins based on market worth:\n");
    console.log(getCoinList(sortedCoinsMerge));
    console.log(`Time Complexity: O(n${getCaseType('mergeSort', numCoins)}`);

    console.log("Quick Sort:");
    console.log("Sorted coins based on market cap:\n");
    console.log(getCoinList(sortedCoinsQuick));
    console.log(`Time Complexity: O(n${getCaseType('quickSort', numCoins)})`);
  })
  .catch(error => console.log(error));

function getRandomCoins(coins, num) {
  const shuffled = coins.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function getCoinList(coins) {
  return coins.map(coin => `${coin.name} (${coin.symbol}): $${coin.market_cap}`).join('<br>');
}

function getCaseType(sortingAlgorithm, numCoins) {
  const arrLength = numCoins;

  switch (sortingAlgorithm) {
    case 'mergeSort':
      if (arrLength <= 1) {
        return 'O(1)';
      } else {
        return 'O(n log n)';
      }

    case 'quickSort':
      if (arrLength <= 1) {
        return 'O(1)';
      } 
        else {
        return 'O(n log n)';
      }

    default:
      return 'Unknown Case';
  }
}
