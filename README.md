# RxJS

Exploring the usage of the amazing [RxJS](https://rxjs.dev/).

## Getting started

Install the node dependencies

```bash
$> yarn install
# OR
$> npm install
```

Once those are installed you can run a local dev server with [snowpack](https://www.snowpack.dev/).

```bash
$> yarn dev
# OR
$> npm run dev
```

## Examples

### Mouse Move

Here we're capturing the `mousemove` event. When we run it through a `pipe()` we can easily run operators like `throttleTime()`, `debounceTime()`, `filter()`, etc. Here we're also `tap()`ing into the pipe so that we can debug/console.log the data as it flows through the pipe. Then we `map()` the output to be returned and ultimately written to the DOM.

### Church Norris

In this example, we're making API called to a Church Norris joke generator. We're using the RxJS `ajax` utility and we're running it inside the `switchMap()` operator, which allows us to keep only the latest request from a series of events that are active/haven't yet emitted; in this case, this also cancels any previous API calls (can be seen in the network tab) that have not returned/emitted yet).

### Double Click

How do you detect a double-click (or more) in the browser? With RxJS, we can collect a series of click events, debounced for 300ms and count the length of the buffer after it returns (essentially we wait for the user to pause clicking for longer than 300ms). With the `filter()` operator we can check if the length is greater than 2 and if it is we emit.

### Merge Timers

Not only can we subscribe to observables created by browser events, but we can also generate our own events. One example is to use `interval()` to emit events every X amount of time. In this example we're setting up 4 intervals to emit every 1s, 2s, 3s and 4s respectively. We then handle each emitted even as they come in using the `merge()` function, effectively giving us a single timeline comprised with the events emitted from all 4 observables as they become available.

### Combine Latest Timers

Finally, we're going to use the `timer()` function to create 3 observables that fire every 4s, but that initially wait 1s, 2s and 3s respectively. Once all observables have emitted at least once, we'll grab the latest value from each observable and emit that as a single event with an array of values using the `combineLatest()` function.
