import { useEffect, useState } from "react";
import { observeDocument } from "./observableFirestore";
import { IObservableValue, observable } from "mobx";

export function useObservableFirestoreReference<T>(
  ref: firebase.firestore.DocumentReference,
  converter: firebase.firestore.FirestoreDataConverter<T>,
  deps: unknown[]
): IObservableValue<T | undefined> {
  const [observableItem, setObservableItem] = useState<
    IObservableValue<T | undefined>
  >(observable.box());

  useEffect(() => {
    const { item, unsubscribe } = observeDocument(ref, converter);
    setObservableItem(item);

    return unsubscribe;
    // eslint-disable-next-line
  }, deps);

  return observableItem;
}
