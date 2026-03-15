import { DOCUMENTS_TABLE, Timestamp, applyConstraints, applyDocumentMutation, createDocumentId, fetchCollectionRows, fetchDocumentRow, insertDocumentRow, limit, materializeRow, orderBy, serverTimestamp, toStoredData, upsertDocumentRow, where, type LimitConstraint, type MaterializedDocument, type OrderByConstraint, type QueryConstraint, type WhereConstraint } from '../../../shared/documentStore';
import { supabase } from './client';

export { Timestamp, limit, orderBy, serverTimestamp, where };

type CollectionReference = {
  kind: 'collection';
  collection: string;
};

type DocumentReference = {
  kind: 'document';
  collection: string;
  id: string;
};

type QueryReference = {
  kind: 'query';
  collection: string;
  constraints: QueryConstraint[];
};

type CollectionSource = CollectionReference | QueryReference;

export type FirestoreRef = CollectionReference | DocumentReference | QueryReference;

export const db = {
  provider: 'supabase-documents',
} as const;

export class CompatDocumentSnapshot {
  readonly id: string;
  private readonly row: MaterializedDocument | null;

  constructor(collection: string, id: string, row: MaterializedDocument | null) {
    this.id = id;
    this.row = row?.collection === collection ? row : null;
  }

  exists() {
    return Boolean(this.row);
  }

  data(): any {
    return this.row ? { ...this.row.data } : undefined;
  }
}

export class CompatQuerySnapshot {
  readonly docs: CompatDocumentSnapshot[];

  constructor(rows: MaterializedDocument[]) {
    this.docs = rows.map((row) => new CompatDocumentSnapshot(row.collection, row.id, row));
  }

  get empty() {
    return this.docs.length === 0;
  }

  get size() {
    return this.docs.length;
  }

  forEach(callback: (snapshot: CompatDocumentSnapshot) => void) {
    this.docs.forEach((snapshot) => callback(snapshot));
  }
}

export function collection(_db: typeof db, collectionName: string): CollectionReference {
  return {
    kind: 'collection',
    collection: collectionName,
  };
}

export function doc(
  refOrDb: typeof db | CollectionReference,
  collectionNameOrId: string,
  maybeId?: string,
): DocumentReference {
  if ('kind' in refOrDb && refOrDb.kind === 'collection') {
    return {
      kind: 'document',
      collection: refOrDb.collection,
      id: collectionNameOrId,
    };
  }

  if (!maybeId) {
    throw new Error('Document id is required.');
  }

  return {
    kind: 'document',
    collection: collectionNameOrId,
    id: maybeId,
  };
}

export function query(
  ref: CollectionReference,
  ...constraints: Array<WhereConstraint | OrderByConstraint | LimitConstraint>
): QueryReference {
  return {
    kind: 'query',
    collection: ref.collection,
    constraints,
  };
}

export async function getDoc(ref: DocumentReference) {
  const row = await fetchDocumentRow(supabase, ref.collection, ref.id);
  return new CompatDocumentSnapshot(ref.collection, ref.id, row ? materializeRow(row) : null);
}

export async function getDocs(ref: CollectionSource | CollectionReference) {
  const collectionName = ref.collection;
  const rows = await fetchCollectionRows(supabase, collectionName);
  const materialized = rows.map((row) => materializeRow(row));
  const filteredRows = ref.kind === 'query' ? applyConstraints(materialized, ref.constraints) : materialized;
  return new CompatQuerySnapshot(filteredRows);
}

export async function setDoc(
  ref: DocumentReference,
  data: Record<string, unknown>,
  options?: { merge?: boolean },
) {
  const existingRow = await fetchDocumentRow(supabase, ref.collection, ref.id);
  const existingData = existingRow ? materializeRow(existingRow).data : null;
  const nextData = applyDocumentMutation(existingData, data, options?.merge ? 'merge' : 'set');
  const now = new Date().toISOString();

  await upsertDocumentRow(supabase, {
    collection: ref.collection,
    id: ref.id,
    data: toStoredData(nextData),
    created_at: existingRow?.created_at ?? now,
    updated_at: now,
  });
}

export async function updateDoc(ref: DocumentReference, data: Record<string, unknown>) {
  const existingRow = await fetchDocumentRow(supabase, ref.collection, ref.id);
  if (!existingRow) {
    throw new Error(`Document ${ref.collection}/${ref.id} does not exist.`);
  }

  const existingData = materializeRow(existingRow).data;
  const nextData = applyDocumentMutation(existingData, data, 'update');
  const now = new Date().toISOString();

  await upsertDocumentRow(supabase, {
    collection: ref.collection,
    id: ref.id,
    data: toStoredData(nextData),
    created_at: existingRow.created_at,
    updated_at: now,
  });
}

export async function addDoc(
  ref: CollectionReference,
  data: Record<string, unknown>,
) {
  const id = createDocumentId();
  const now = new Date().toISOString();
  const nextData = applyDocumentMutation(null, data, 'set');

  await insertDocumentRow(supabase, {
    collection: ref.collection,
    id,
    data: toStoredData(nextData),
    created_at: now,
    updated_at: now,
  });

  return doc(ref, id);
}

export function onSnapshot(
  ref: DocumentReference,
  callback: (snapshot: CompatDocumentSnapshot) => void,
  errorCallback?: (error: unknown) => void,
): () => void;
export function onSnapshot(
  ref: QueryReference | CollectionReference,
  callback: (snapshot: CompatQuerySnapshot) => void,
  errorCallback?: (error: unknown) => void,
): () => void;
export function onSnapshot(
  ref: DocumentReference | QueryReference | CollectionReference,
  callback: (snapshot: any) => void,
  errorCallback?: (error: unknown) => void,
) {
  let isActive = true;

  const emitSnapshot = async () => {
    if (!isActive) {
      return;
    }

    try {
      const snapshot =
        ref.kind === 'document'
          ? await getDoc(ref)
          : await getDocs(ref.kind === 'query' ? ref : collection(db, ref.collection));

      if (isActive) {
        callback(snapshot);
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      } else {
        console.error('Supabase realtime snapshot failed:', error);
      }
    }
  };

  void emitSnapshot();

  const channel = supabase
    .channel(`documents:${ref.collection}:${createDocumentId()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: DOCUMENTS_TABLE,
        filter: `collection=eq.${ref.collection}`,
      },
      () => {
        void emitSnapshot();
      },
    )
    .subscribe();

  return () => {
    isActive = false;
    void supabase.removeChannel(channel);
  };
}
