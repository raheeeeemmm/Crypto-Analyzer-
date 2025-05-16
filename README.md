# Crypto-Analyzer-
1.	Project Name:

CRYPTO ANALYZER
2.	Introduction:

                                      In this project, Crypto Analyzer is a webpage that aims to give data of cryptocurrency. There are options of getting live price of crypto coins, getting live chart, comparing graphs of coins, and sorting coins according to market cap.

3.	Appearance:
                             After opening the web, there will be 4 options.

•	Track Live Price
•	Get Historical Price Chart
•	Compare Coins
•	Sort Coins

4.	Working:

•	Track Live Price: For tracking price, we are fetching data from API. It gives us the real time price of entered coin symbol (e.g. btc)

•	Get Historical Price Chart: For getting historical chart, we are getting last month data of coins from Coingecko API. After that we are using charts.js library to generate chart. It gives tell price of coin wherever we take cursor. (e.g if we take cursor to the point that was last week, it will give the price of coin at that time)
•	Compare Coins: This function is for comparing the prices of 2 coins. It will provide us the data of both coins of last month. It fetches data from API and generates chart of both coins on a same graph. 

•	Sort Coins: This function is for sorting coins according to market cap. We have taken data of top 50 coins from API and then we sort data of these coins. We will write number of coins we want to sort and it will sort them with quick sort and merge sort

5.	ANALYSIS:

For tracking live price , time complexity will be
O(f(N)) + O(N) + O(1)
The time complexity of fetching the list of coins using the fetch function is denoted as O(f(N)), where f(N) represents the time complexity of the API request and processing the response.
The time complexity of the find method is O(N), where N is the number of coins in the list.


For getting historical prices , time complexity will be
O(f(N)) + O(N) + O(1) + O(M)
Constructing the chart and rendering it typically has a time complexity of O(M)


For comparing coins, Time complexity will be
O(f(N)) + O(N) + O(1) + O(M)+O(M)
As we are getting data of 2 coins, so time complexity will increase by O(M).

In sorting part, it is getting random coins so time complexity will be different.
Merge Sort: Time complexity of merge sort is O(n log n) for best, worst and average case.
When there will be array of already sorted, it will be worst case.
Otherwise it will be average case.

Quick Sort: Time complexity of merge sort is O(n log n) for best and average case. For worst case, its O(n^2)
When array will be in reverse order, time complexity will be worst.
Otherwise it will be average case.


