// A wrapper for promise executor functions, that
// throws an error after the given timeout.
function executorWrapper(func, timeout) {
// This is the function that's actually called by the
// promise. It takes the resolver and rejector functions
// as arguments.
return function executor(resolve, reject) {
// Setup our timer. When time runs out, we can
// reject the promise with a timeout message.
var timer = setTimeout(() => {
reject(`Promise timed out after ${timeout}MS`);
}, timeout);
// Call the original executor function that we're
// wrapping. We're actually wrapping the resolver
// and rejector functions as well, so that when the
// executor calls them, the timer is cleared.
func((value) => {
clearTimeout(timer);
resolve(value);
}, (value) => {
clearTimeout(timer);
reject(value);
});
};
}
// This promise executor times out, and a timeout
// error message is passed to the rejected callback.
new Promise(executorWrapper((resolve, reject) => {
setTimeout(() => {
resolve('done');
}, 2000);
}, 1000)).catch((reason) => {
console.error(reason);

});
// This promise resolves as expected, since the executor
// calls "resolve()" before time's up.
new Promise(executorWrapper((resolve, reject) => {
setTimeout(() => {
resolve(true);
}, 500);
}, 1000)).then((value) => {
console.log('resolved', value);
});