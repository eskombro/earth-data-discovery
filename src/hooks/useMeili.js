import React from "react";
import { StoreContext } from "../store";
import {
  setResult,
  setSearchValue,
  setFacets,
  addResult,
} from "../actions/store";
import MeiliSearch from "meilisearch";

/*
 ** This custom hook is used to manage MeiliSearch.
 */

const client = new MeiliSearch({
  host: "https://sandbox-pool-xi7fypa-3bsbgmeayb75w.ovh-fr-2.platformsh.site/",
  apiKey: "131d7deada079ee0441cb2bc92c399501b5bcfa1678500562052d1e9cb079129",
});

const index = client.getIndex("earthdata");

export function useMeili() {
  const { state, dispatch } = React.useContext(StoreContext);

  // Methods
  async function search({
    toSearch = "",
    offset = null,
    limit = null,
    filters = null,
    facetFilters = null,
    facetsDistribution = null,
    attributesToRetrieve = null,
    attributesToCrop = null,
    cropLength = null,
    attributesToHighlight = null,
    matches = null,
  }) {
    const search = await index.search(toSearch, {
      offset,
      limit,
      filters,
      facetFilters,
      facetsDistribution,
      attributesToRetrieve,
      attributesToCrop,
      cropLength,
      attributesToHighlight,
      matches,
    });
    if (!offset) {
      dispatch(setSearchValue(toSearch));
      dispatch(setResult(search.hits));
    } else dispatch(addResult(search.hits));
  }

  async function getDocument(id) {
    const document = await index.getDocument(id);
    return document;
  }

  async function getDocuments(offset, limit) {
    const documents = await index.getDocuments({
      offset: offset,
      limit: limit,
    });
    return documents;
  }

  async function getFacets() {
    const res = await index.search(null, {
      facetsDistribution: ["*"],
    });
    dispatch(setFacets(res.facetsDistribution));
  }

  return {
    search,
    getFacets,
  };
}