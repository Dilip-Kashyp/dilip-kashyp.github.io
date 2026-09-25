import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const env = (name) => process.env[name];

function normalize(payload) {
  const rows = Array.isArray(payload?.result?.points)
    ? payload.result.points
    : Array.isArray(payload?.result)
      ? payload.result
      : [];

  return rows.reduce(
    (out, row) => {
      const data = row.payload || row;
      const kind = String(data.kind || data.type || data.entity_type || 'node').toLowerCase();
      const result = { ...data, id: row.id ?? data.id, score: row.score };

      if (kind.includes('edge') || data.from || data.from_entity || data.relationship) {
        out.edges.push(result);
      } else {
        out.nodes.push(result);
      }
      return out;
    },
    { nodes: [], edges: [] }
  );
}

async function queryCollection(collection, query, queryVector) {
  const body = {
    limit: Number(env('DEFAULT_TOP_K') || 5),
    with_payload: true,
    query: queryVector || {
      text: query,
      model: env('QDRANT_EMBEDDING_MODEL') || 'sentence-transformers/all-MiniLM-L6-v2',
    },
  };

  const response = await fetch(
    `${env('QDRANT_URL').replace(/\/$/, '')}/collections/${encodeURIComponent(collection)}/points/query`,
    {
      method: 'POST',
      headers: {
        'api-key': env('QDRANT_API_KEY'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Qdrant query failed for ${collection}: ${details.slice(0, 300)}`);
  }

  return response.json();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const query = typeof body.query === 'string' ? body.query.trim() : '';

    if (!query) {
      return NextResponse.json({ error: 'A non-empty query is required.' }, { status: 400 });
    }

    if (!env('QDRANT_URL') || !env('QDRANT_API_KEY')) {
      return NextResponse.json({ error: 'Qdrant is not configured.' }, { status: 503 });
    }

    const queryVector = Array.isArray(body.queryVector) ? body.queryVector : null;
    const collections = [
      ...new Set(
        [env('KB_NODES_COLLECTION'), env('KB_EDGES_COLLECTION'), env('QDRANT_COLLECTION')].filter(
          Boolean
        )
      ),
    ];

    if (!collections.length) {
      return NextResponse.json({ error: 'No Qdrant collections are configured.' }, { status: 503 });
    }

    const results = await Promise.all(
      collections.map((collection) => queryCollection(collection, query, queryVector))
    );
    const normalized = results.reduce(
      (out, result) => {
        const current = normalize(result);
        out.nodes.push(...current.nodes);
        out.edges.push(...current.edges);
        return out;
      },
      { nodes: [], edges: [] }
    );

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Knowledge-base query failed:', error);
    return NextResponse.json(
      { error: error.message || 'Knowledge-base query failed.' },
      { status: 502 }
    );
  }
}
