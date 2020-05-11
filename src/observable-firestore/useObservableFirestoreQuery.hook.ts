import { useEffect, useState } from "react";
import { observeCollection } from "./observableFirestore";

export function useObservableFirestoreQuery<T>(
  query: firebase.firestore.Query,
  converter: firebase.firestore.FirestoreDataConverter<T>,
  deps: any[]
): T[] | undefined {
  const [observableItems, setObservableItems] = useState<T[]>();

  useEffect(() => {
    const { items, unsubscribe } = observeCollection(query, converter);
    setObservableItems(items);

    return unsubscribe;
    // eslint-disable-next-line
  }, deps);

  return observableItems;
}
