import cryptocompare
from datetime import datetime
import time
import random
import matplotlib.pyplot as plt
import json

def get_coin_price(coin):
    current_time = int(time.time())
    historical_data = cryptocompare.get_historical_price_day(coin, currency='USD', toTs=current_time)
    prices = [(data['time'], data['close']) for data in historical_data]
    return prices

def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    merged = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i][1] < right[j][1]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    while i < len(left):
        merged.append(left[i])
        i += 1

    while j < len(right):
        merged.append(right[j])
        j += 1

    return merged

def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[random.randint(0, len(arr) - 1)]
    less = []
    equal = []
    greater = []

    for item in arr:
        if item[1] < pivot[1]:
            less.append(item)
        elif item[1] > pivot[1]:
            greater.append(item)
        else:
            equal.append(item)

    return quick_sort(less) + equal + quick_sort(greater)

def calculate_rsi(prices):
    gains = [prices[i+1] - prices[i] for i in range(len(prices)-1) if prices[i+1] > prices[i]]
    losses = [-prices[i+1] + prices[i] for i in range(len(prices)-1) if prices[i+1] < prices[i]]

    avg_gain = sum(gains) / len(gains) if gains else 0
    avg_loss = sum(losses) / len(losses) if losses else 0

    if avg_loss == 0:
        return 100
    else:
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

def compare_time_complexities():
    num_coins = int(input('Enter the number of coins to sort (up to 10): '))

    if num_coins < 1 or num_coins > 10:
        print('Please enter a valid number of coins (1-10).')
        return

    with open('coins.json', 'r') as f:
        data = json.load(f)

    coins = random.sample(data['cryptocurrencies'], num_coins)
    coin_symbols = [coin['symbol'] for coin in coins]

    prices = {}
    for coin in coins:
        symbol = coin['symbol']
        prices[symbol] = coin['current_price']

    arr = [(symbol, prices[symbol]) for symbol in coin_symbols]

    # Merge Sort
    merge_start_time = time.time()
    merge_sorted = merge_sort(arr)
    merge_end_time = time.time()
    merge_time = merge_end_time - merge_start_time

    # Quick Sort
    quick_start_time = time.time()
    quick_sorted = quick_sort(arr)
    quick_end_time = time.time()
    quick_time = quick_end_time - quick_start_time

    print('Merge Sort:')
    print('Sorted coins based on market worth:')
    for coin, _ in merge_sorted:
        print(coin)
    print('Time Complexity: O(n log n)')
    print(f'Execution Time: {merge_time:.6f} seconds')

    print('\nQuick Sort:')
    print('Sorted coins based on market worth:')
    for coin, _ in quick_sorted:
        print(coin)
    print('Time Complexity: O(n^2) (worst case), O(n log n) (average case)')
    print(f'Execution Time: {quick_time:.6f} seconds')

    if merge_time < quick_time:
        print('\nConclusion: Merge Sort is faster based on execution time.')
    elif merge_time > quick_time:
        print('\nConclusion: Quick Sort is faster based on execution time.')
    else:
        print('\nConclusion: Both sorting algorithms have similar execution times.')

    
def plot_price_chart(coin):
    prices = get_coin_price(coin)
    timestamps, coin_prices = zip(*prices)
    dates = [datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d') for timestamp in timestamps]

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(dates, coin_prices, color='blue')
    ax.set_xlabel('Date')
    ax.set_ylabel('Price (USD)')
    ax.set_title(f'{coin.upper()} Price Chart')
    ax.grid(True)
    ax.spines['bottom'].set_color('gray')
    ax.spines['top'].set_color('gray')
    ax.spines['right'].set_color('gray')
    ax.spines['left'].set_color('gray')

    current_price = coin_prices[-1]
    all_time_high = max(coin_prices)
    ax.annotate(f'Current Price: ${current_price:.2f}', (dates[-1], current_price))
    ax.annotate(f'All-Time High: ${all_time_high:.2f}', (dates[coin_prices.index(all_time_high)], all_time_high),
                xytext=(10, -40), textcoords='offset points',
                arrowprops=dict(arrowstyle='->'))

    plt.xticks(rotation=45)
    plt.show()

def compare_prices(coin1, coin2):
    coins = [coin1, coin2]
    current_prices = {}

    for coin in coins:
        price = cryptocompare.get_price(coin, currency='USD')
        current_prices[coin] = price[coin]["USD"]

    fig, ax = plt.subplots(figsize=(10, 6))

    for coin in coins:
        coin_prices = get_coin_price(coin)
        timestamps, prices = zip(*coin_prices)
        dates = [datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d') for timestamp in timestamps]
        ax.plot(dates, prices, label=coin.upper())

    ax.set_xlabel('Date')
    ax.set_ylabel('Price (USD)')
    ax.set_title('Price Comparison')
    ax.legend()
    ax.grid(True)
    ax.spines['bottom'].set_color('gray')
    ax.spines['top'].set_color('gray')
    ax.spines['right'].set_color('gray')
    ax.spines['left'].set_color('gray')

    plt.xticks(rotation=45)
    plt.show()

def main():
    while True:
        print('1. Track live prices')
        print('2. Get historical price chart')
        print('3. Compare coins')
        print('4. Sort coins')
        print('5. Exit')

        choice = input('Enter your choice: ')

        if choice == '1':
            coin = input('Enter the coin symbol (e.g., BTC): ').upper()
            price = cryptocompare.get_price(coin, currency='USD')
            print(f'Current price of {coin.upper()}: ${price[coin]["USD"]:.2f}\n')

        elif choice == '2':
            coin = input('Enter the coin symbol (e.g., BTC): ').upper()
            plot_price_chart(coin)

        elif choice == '3':
            coin1 = input('Enter the first coin symbol (e.g., BTC): ').upper()
            coin2 = input('Enter the second coin symbol (e.g., ETH): ').upper()
            compare_prices(coin1, coin2)

        elif choice == '4':
            compare_time_complexities()

        elif choice == '5':
            break

        else:
            print('Invalid choice. Please try again.\n')

if __name__ == '__main__':
    main()
