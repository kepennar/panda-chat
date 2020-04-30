interface ChangesListener<CallbackType> {
  CALLBACKS: CallbackType[];
  registerOnChanges: (callback: CallbackType) => void;
  unregisterOnChanges: (callback: CallbackType) => void;
}
export function createChangesListener<CallbackType>(): ChangesListener<
  CallbackType
> {
  return {
    CALLBACKS: [],
    registerOnChanges(callback: CallbackType) {
      this.CALLBACKS = [...this.CALLBACKS, callback];
    },
    unregisterOnChanges(callback: CallbackType) {
      this.CALLBACKS = this.CALLBACKS.filter(
        (existing) => existing !== callback
      );
    },
  };
}
