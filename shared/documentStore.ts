import type { SupabaseClient } from '@supabase/supabase-js';

export const DOCUMENTS_TABLE = 'documents';
const TIMESTAMP_MARKER = '__novalyte_type';
const TIMESTAMP_TYPE = 'timestamp';
const FIELD_VALUE_MARKER = '__novalyte_field_value';

type TimestampMarker = {
  [TIMESTAMP_MARKER]: typeof TIMESTAMP_TYPE;
  value: string;
};

type ServerTimestampFieldValue = {
  [FIELD_VALUE_MARKER]: 'serverTimestamp';
};

type IncrementFieldValue = {
  [FIELD_VALUE_MARKER]: 'increment';
  amount: number;
};

type ArrayUnionFieldValue = {
  [FIELD_VALUE_MARKER]: 'arrayUnion';
  values: unknown[];
};

export type FirestoreFieldValue =
  | ServerTimestampFieldValue
  | IncrementFieldValue
  | ArrayUnionFieldValue;

export type FirestoreComparisonOperator =
  | '=='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'array-contains';

export type WhereConstraint = {
  type: 'where';
  fieldPath: string;
  operator: FirestoreComparisonOperator;
  value: unknown;
};

export type OrderByConstraint = {
  type: 'orderBy';
  fieldPath: string;
  direction: 'asc' | 'desc';
};

export type LimitConstraint = {
  type: 'limit';
  count: number;
};

export type QueryConstraint = WhereConstraint | OrderByConstraint | LimitConstraint;

export type StoredDocumentRow = {
  collection: string;
  id: string;
  data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type MaterializedDocument = {
  collection: string;
  id: string;
  data: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class Timestamp {
  private readonly isoValue: string;

  constructor(value: string | Date) {
    this.isoValue = value instanceof Date ? value.toISOString() : value;
  }

  static fromDate(date: Date) {
    return new Timestamp(date);
  }

  static now() {
    return new Timestamp(new Date());
  }

  toDate() {
    return new Date(this.isoValue);
  }

  toMillis() {
    return this.toDate().getTime();
  }

  toISOString() {
    return this.isoValue;
  }

  toJSON(): TimestampMarker {
    return {
      [TIMESTAMP_MARKER]: TIMESTAMP_TYPE,
      value: this.isoValue,
    };
  }

  valueOf() {
    return this.toMillis();
  }
}

export const FieldValue = {
  serverTimestamp(): FirestoreFieldValue {
    return {
      [FIELD_VALUE_MARKER]: 'serverTimestamp',
    };
  },
  increment(amount: number): FirestoreFieldValue {
    return {
      [FIELD_VALUE_MARKER]: 'increment',
      amount,
    };
  },
  arrayUnion(...values: unknown[]): FirestoreFieldValue {
    return {
      [FIELD_VALUE_MARKER]: 'arrayUnion',
      values,
    };
  },
};

export function serverTimestamp() {
  return FieldValue.serverTimestamp();
}

export function where(
  fieldPath: string,
  operator: FirestoreComparisonOperator,
  value: unknown,
): WhereConstraint {
  return {
    type: 'where',
    fieldPath,
    operator,
    value,
  };
}

export function orderBy(
  fieldPath: string,
  direction: 'asc' | 'desc' = 'asc',
): OrderByConstraint {
  return {
    type: 'orderBy',
    fieldPath,
    direction,
  };
}

export function limit(count: number): LimitConstraint {
  return {
    type: 'limit',
    count,
  };
}

export function createDocumentId() {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function materializeRow(row: StoredDocumentRow): MaterializedDocument {
  return {
    collection: row.collection,
    id: row.id,
    data: deserializeValue(row.data ?? {}) as Record<string, unknown>,
    createdAt: new Timestamp(row.created_at),
    updatedAt: new Timestamp(row.updated_at),
  };
}

export function applyDocumentMutation(
  existing: Record<string, unknown> | null,
  patch: Record<string, unknown>,
  mode: 'set' | 'merge' | 'update',
) {
  const base = mode === 'set' ? {} : deepClone(existing ?? {});

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      continue;
    }

    const nextValue = applyValueMutation((base as Record<string, unknown>)[key], value);
    (base as Record<string, unknown>)[key] = nextValue;
  }

  return base as Record<string, unknown>;
}

export function toStoredData(data: Record<string, unknown>) {
  return serializeValue(data) as Record<string, unknown>;
}

export function applyConstraints(
  rows: MaterializedDocument[],
  constraints: QueryConstraint[] = [],
) {
  let result = [...rows];

  const filters = constraints.filter((constraint): constraint is WhereConstraint => constraint.type === 'where');
  if (filters.length > 0) {
    result = result.filter((row) => filters.every((filter) => matchesWhere(row.data, filter)));
  }

  const orderings = constraints.filter(
    (constraint): constraint is OrderByConstraint => constraint.type === 'orderBy',
  );
  if (orderings.length > 0) {
    result.sort((left, right) => compareByOrderings(left.data, right.data, orderings));
  }

  const limitConstraint = constraints.find(
    (constraint): constraint is LimitConstraint => constraint.type === 'limit',
  );
  if (limitConstraint) {
    result = result.slice(0, limitConstraint.count);
  }

  return result;
}

export async function fetchDocumentRow(
  client: SupabaseClient,
  collection: string,
  id: string,
) {
  const { data, error } = await client
    .from(DOCUMENTS_TABLE)
    .select('collection,id,data,created_at,updated_at')
    .eq('collection', collection)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as StoredDocumentRow | null) ?? null;
}

export async function fetchCollectionRows(
  client: SupabaseClient,
  collection: string,
) {
  const { data, error } = await client
    .from(DOCUMENTS_TABLE)
    .select('collection,id,data,created_at,updated_at')
    .eq('collection', collection)
    .range(0, 4999);

  if (error) {
    throw error;
  }

  return (data as StoredDocumentRow[] | null) ?? [];
}

export async function upsertDocumentRow(
  client: SupabaseClient,
  row: {
    collection: string;
    id: string;
    data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  },
) {
  const { error } = await client
    .from(DOCUMENTS_TABLE)
    .upsert(row, {
      onConflict: 'collection,id',
      ignoreDuplicates: false,
    });

  if (error) {
    throw error;
  }
}

export async function insertDocumentRow(
  client: SupabaseClient,
  row: {
    collection: string;
    id: string;
    data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  },
) {
  const { error } = await client.from(DOCUMENTS_TABLE).insert(row);
  if (error) {
    throw error;
  }
}

function applyValueMutation(existingValue: unknown, incomingValue: unknown) {
  if (isFieldValue(incomingValue)) {
    return resolveFieldValue(existingValue, incomingValue);
  }

  return deepClone(incomingValue);
}

function resolveFieldValue(existingValue: unknown, fieldValue: FirestoreFieldValue) {
  switch (fieldValue[FIELD_VALUE_MARKER]) {
    case 'serverTimestamp':
      return Timestamp.now();
    case 'increment':
      return Number(existingValue ?? 0) + fieldValue.amount;
    case 'arrayUnion': {
      const currentValues = Array.isArray(existingValue) ? [...existingValue] : [];
      for (const value of fieldValue.values) {
        if (!currentValues.some((entry) => areEqual(entry, value))) {
          currentValues.push(deepClone(value));
        }
      }
      return currentValues;
    }
  }
}

function matchesWhere(data: Record<string, unknown>, constraint: WhereConstraint) {
  const currentValue = getValueAtPath(data, constraint.fieldPath);
  const comparisonValue = constraint.value;

  if (constraint.operator === 'array-contains') {
    return Array.isArray(currentValue) && currentValue.some((entry) => areEqual(entry, comparisonValue));
  }

  const left = normalizeComparableValue(currentValue);
  const right = normalizeComparableValue(comparisonValue);

  switch (constraint.operator) {
    case '==':
      return areEqual(currentValue, comparisonValue);
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    default:
      return false;
  }
}

function compareByOrderings(
  leftData: Record<string, unknown>,
  rightData: Record<string, unknown>,
  orderings: OrderByConstraint[],
) {
  for (const ordering of orderings) {
    const left = normalizeComparableValue(getValueAtPath(leftData, ordering.fieldPath));
    const right = normalizeComparableValue(getValueAtPath(rightData, ordering.fieldPath));
    if (left === right) {
      continue;
    }

    const direction = ordering.direction === 'desc' ? -1 : 1;
    return left > right ? direction : -1 * direction;
  }

  return 0;
}

function getValueAtPath(source: Record<string, unknown>, fieldPath: string) {
  return fieldPath.split('.').reduce<unknown>((currentValue, segment) => {
    if (!isPlainObject(currentValue)) {
      return undefined;
    }

    return currentValue[segment];
  }, source);
}

function normalizeComparableValue(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return value as string | number | boolean | null | undefined;
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toJSON();
  }

  if (value instanceof Date) {
    return new Timestamp(value).toJSON();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => serializeValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, serializeValue(entry)]),
    );
  }

  return value;
}

function deserializeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => deserializeValue(entry));
  }

  if (isTimestampMarker(value)) {
    return new Timestamp(value.value);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, deserializeValue(entry)]),
    );
  }

  return value;
}

function deepClone<T>(value: T): T {
  return deserializeValue(serializeValue(value)) as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isTimestampMarker(value: unknown): value is TimestampMarker {
  return (
    isPlainObject(value) &&
    value[TIMESTAMP_MARKER] === TIMESTAMP_TYPE &&
    typeof value.value === 'string'
  );
}

function isFieldValue(value: unknown): value is FirestoreFieldValue {
  return isPlainObject(value) && typeof value[FIELD_VALUE_MARKER] === 'string';
}

function areEqual(left: unknown, right: unknown) {
  return JSON.stringify(serializeValue(left)) === JSON.stringify(serializeValue(right));
}
