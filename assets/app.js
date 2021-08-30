import { fromEvent, interval, merge, combineLatest, timer } from "rxjs";
import {
  throttleTime,
  tap,
  map,
  switchMap,
  buffer,
  filter,
  debounceTime,
  take,
  mapTo,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// From Event - Mouse Move
// @return Observable
let mouseMove$ = fromEvent(
  document.getElementById("mousemove-card"),
  "mousemove"
);
let mouseMoveOutput = document.getElementById("mousemove-output");

mouseMove$
  .pipe(
    // Operators
    throttleTime(600),
    // debounceTime(200),
    // filter(e =>
    //    e.layerX > 0
    //    && e.layerX < 200
    //    && e.layerY > 0
    //    && e.layerY < 200
    // ),
    tap((x) => console.log("log:", x)),
    map((e) => {
      return {
        clientX: e.clientX,
        clientY: e.clientY,
        layerX: e.layerX,
        layerY: e.layerY,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      };
    })
  )
  .subscribe((x) => {
    // Observer
    mouseMoveOutput.innerText = JSON.stringify(x, null, 2);
  });

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Ajax - CHUCK NORRIS
let chuck$ = fromEvent(document.getElementById("chuck-button"), "click");
let chuckOutput = document.getElementById("chuck-output");

chuck$
  .pipe(
    // switchMap() only keeps last request. previous requests are cancelled.
    switchMap(() => {
      // getJSON() uses XMLHttpRequest under the hood
      return ajax.getJSON("https://api.chucknorris.io/jokes/random");
    })
  )
  .subscribe((x) => {
    chuckOutput.innerText = x.value;
  });

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Double Click
let doubleClickButton$ = fromEvent(
  document.getElementById("doubleclick-button"),
  "click"
);
doubleClickButton$.subscribe(() => console.log("click"));
let doubleClicks$ = doubleClickButton$.pipe(
  // buffer() collects the incoming Observable values until the given closingNotifier
  // Observable emits a value, at which point it emits the buffer on the output Observable
  //  and starts a new buffer internally, awaiting the next time closingNotifier emits.
  buffer(doubleClickButton$.pipe(debounceTime(300))),
  map((x) => x.length),
  tap((x) => console.log("map:", x)),
  filter((x) => x >= 2)
);

let doubleclickOutput = document.getElementById("doubleclick-output");
// print the double clicks
doubleClicks$.subscribe((x) => {
  doubleclickOutput.innerHTML = `<h5>Double+ Click: ${x}</h5>`;
});

// reset the output after 1s
doubleClicks$.pipe(debounceTime(1000)).subscribe((x) => {
  doubleclickOutput.innerHTML = "<h5>Fart in the wind...</h5>";
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Merge - Timers
let mergeoutput = document.getElementById("merge-output");
fromEvent(document.getElementById("merge-button"), "click").subscribe(() => {
  mergeoutput.innerHTML = "<h5>Go baby go!</h5>";
  initMerge();
});

function initMerge() {
  //emit every 1 seconds
  const first$ = interval(1000);
  //emit every 2 seconds
  const second$ = interval(2000);
  //emit every 3 seconds
  const third$ = interval(3000);
  //emit every 4 seconds
  const fourth$ = interval(4000);

  // emit outputs from one observable
  // merge() subscribes to each given input Observable (as arguments), and simply
  // forwards (without doing any transformation) all the values from all the
  // input Observables to the output Observable. The output Observable only
  // completes once all input Observables have completed. Any error delivered by
  // an input Observable will be immediately emitted on the output Observable.
  const example$ = merge(
    first$.pipe(mapTo("FIRST!"), take(3)),
    second$.pipe(mapTo("SECOND!"), take(3)),
    third$.pipe(mapTo("THIRD"), take(3)),
    fourth$.pipe(mapTo("FOURTH"), take(3))
  );
  // output: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
  // Subscription
  const subscribe = example$.subscribe(
    (val) => (mergeoutput.innerHTML += `<p>${val}</p>`)
  );
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// CombineLatest - Timers

let combinelatest = document.getElementById("combinelatest-output");
fromEvent(document.getElementById("combinelatest-button"), "click").subscribe(
  () => {
    combinelatest.innerHTML = "<h5>Go baby go!</h5>";
    initCombineLatest();
  }
);

function initCombineLatest() {
  //timerOne emits first value at 1s, then once every 4s
  const timerOne$ = timer(1000, 4000).pipe(take(3));
  //timerTwo emits first value at 2s, then once every 4s
  const timerTwo$ = timer(2000, 4000).pipe(take(3));
  //timerThree emits first value at 3s, then once every 4s
  const timerThree$ = timer(3000, 4000).pipe(take(3));

  //when one timer emits, emit the latest values from each timer as an array
  const combined$ = combineLatest([timerOne$, timerTwo$, timerThree$]);
  combined$.subscribe(([timerValOne, timerValTwo, timerValThree]) => {
    combinelatest.innerHTML += `<p>Timer One Latest: ${timerValOne}</p>
      <p>Timer Two Latest: ${timerValTwo}</p>
      <p>Timer Three Latest: ${timerValThree}</p><p><hr></p>`;
  });
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
