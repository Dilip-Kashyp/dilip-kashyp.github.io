# Dilip-Kashyp.github.io

## Knowledge-base chat

The [chat page](./chat.html) sends each question as a `POST` request to
`/api/query-kb`:

```json
{ "query": "your question here" }
```

The endpoint should return node and edge results in either of these shapes:

```json
{
  "nodes": [{ "title": "...", "type": "...", "tier": "...", "use_when": "...", "snippet": "..." }],
  "edges": [{ "from_entity": "...", "relationship": "...", "to_entity": "...", "status": "..." }]
}
```

or the Python search-wrapper shape:

```json
{
  "node_results": { "results": [] },
  "edge_results": { "results": [] }
}
```

If the API is hosted at another path, update the `data-api-endpoint` value on
the chat form in [chat.html](./chat.html).
