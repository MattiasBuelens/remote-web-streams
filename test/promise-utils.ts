export function isPending(promise: Promise<any>): Promise<boolean> {
  const sentinel = {};
  return Promise.race([promise, Promise.resolve(sentinel)])
    .then(
      (value) => value === sentinel,
      (reason) => false
    );
}
