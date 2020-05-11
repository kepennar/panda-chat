import * as firebase from "firebase";
import { observable, runInAction, IObservableValue } from "mobx";
type ObservableEntry = { unsubscribe: () => void; registrationCount: number };

type ObservableArray<T> = ObservableEntry & {
  items: T[];
};

type ObservableItem<T> = ObservableEntry & {
  item: IObservableValue<T | undefined>;
};

const existingQueries: Map<
  firebase.firestore.Query,
  ObservableArray<any>
> = new Map();

const existingReferences: Map<
  firebase.firestore.DocumentReference,
  ObservableItem<any>
> = new Map();

export function observeCollection<T>(
  query: firebase.firestore.Query,
  converter: firebase.firestore.FirestoreDataConverter<T>
): ObservableArray<T> {
  const withConverterQuery = query.withConverter(converter);

  const existingRegistration = Array.from(
    existingQueries.entries()
  ).find(([query]) => query.isEqual(withConverterQuery));
  if (!existingRegistration) {
    const items = observable.array<T>();
    const disconnect = withConverterQuery.onSnapshot((snapshot) => {
      runInAction(() => {
        items.replace(snapshot.docs.map((doc) => doc.data()));
      });
    });
    const unsubscribe = () => {
      const observableEntry = existingQueries.get(withConverterQuery);
      if (observableEntry?.registrationCount === 1) {
        existingQueries.delete(withConverterQuery);
        disconnect();
      } else if (observableEntry) {
        observableEntry.registrationCount--;
        existingQueries.set(withConverterQuery, observableEntry);
      }
    };
    const observableEntry = { items, unsubscribe, registrationCount: 1 };
    existingQueries.set(withConverterQuery, observableEntry);

    return observableEntry;
  } else {
    const [query, entry] = existingRegistration;
    const observableEntry = {
      ...entry,
      registrationCount: entry.registrationCount + 1,
    };
    existingQueries.set(query, observableEntry);
    return observableEntry;
  }
}

export function observeDocument<T>(
  ref: firebase.firestore.DocumentReference,
  converter: firebase.firestore.FirestoreDataConverter<T>
): ObservableItem<T> {
  const withConverterRef = ref.withConverter(converter);

  const existingRegistration = Array.from(
    existingReferences.entries()
  ).find(([ref]) => ref.isEqual(withConverterRef));
  if (!existingRegistration) {
    const observableItem = observable.box<T | undefined>();
    const disconnect = withConverterRef.onSnapshot((snapshot) => {
      runInAction(() => {
        observableItem.set(snapshot.data());
      });
    });

    const unsubscribe = () => {
      const observableEntry = existingReferences.get(withConverterRef);
      if (observableEntry?.registrationCount === 1) {
        existingReferences.delete(withConverterRef);
        disconnect();
      } else if (observableEntry) {
        observableEntry.registrationCount--;
      }
    };
    const observableEntry = {
      item: observableItem,
      unsubscribe,
      registrationCount: 1,
    };
    existingReferences.set(withConverterRef, observableEntry);
    return observableEntry;
  } else {
    const [ref, entry] = existingRegistration;
    const observableEntry = {
      ...entry,
      registrationCount: entry.registrationCount + 1,
    };
    existingReferences.set(ref, observableEntry);
    return observableEntry;
  }
}

let existingAuthObserver: ObservableItem<firebase.User | null> | null = null;

export function observeAuthChanged(auth: firebase.auth.Auth) {
  if (!existingAuthObserver) {
    const authObservable = observable.box<firebase.User | null>();
    const disconnect = auth.onAuthStateChanged(async (userAuth) => {
      runInAction(() => {
        authObservable.set(userAuth);
      });
    });
    const unsubscribe = () => {
      if (existingAuthObserver?.registrationCount === 1) {
        existingAuthObserver = null;
        disconnect();
      } else if (existingAuthObserver) {
        existingAuthObserver.registrationCount--;
      }
    };
    return {
      item: authObservable,
      unsubscribe,
      registrationCount: 1,
    };
  } else {
    existingAuthObserver.registrationCount++;
    return existingAuthObserver;
  }
}
