"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { EpisodeSummary } from "@/lib/episode";
import { EpisodeArchiveCard } from "./episode-card";

type Filters = {
  query: string;
  season: string;
  tag: string;
  sort: "newest" | "oldest";
};

const defaultFilters: Filters = {
  query: "",
  season: "all",
  tag: "all",
  sort: "newest",
};

const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ja").trim();

const readFiltersFromUrl = (): Filters => {
  if (typeof window === "undefined") return defaultFilters;
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    season: params.get("season") ?? "all",
    tag: params.get("tag") ?? "all",
    sort: params.get("sort") === "oldest" ? "oldest" : "newest",
  };
};

const writeFiltersToUrl = (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.season !== "all") params.set("season", filters.season);
  if (filters.tag !== "all") params.set("tag", filters.tag);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  const query = params.toString();
  window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
};

export function EpisodeBrowser({ episodes }: { episodes: EpisodeSummary[] }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const deferredQuery = useDeferredValue(filters.query);

  useEffect(() => {
    const syncFromUrl = () => setFilters(readFiltersFromUrl());
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const seasons = useMemo(
    () => [...new Set(episodes.map((episode) => episode.season))].sort((a, b) => a - b),
    [episodes],
  );
  const tags = useMemo(
    () => [...new Set(episodes.flatMap((episode) => episode.tags))].sort((a, b) => a.localeCompare(b, "ja")),
    [episodes],
  );

  const visibleEpisodes = useMemo(() => {
    const query = normalize(deferredQuery);
    return episodes
      .filter((episode) => filters.season === "all" || episode.season === Number(filters.season))
      .filter((episode) => filters.tag === "all" || episode.tags.includes(filters.tag))
      .filter((episode) => {
        if (!query) return true;
        const episodeLabel = String(episode.episode).padStart(3, "0");
        const searchText = normalize([
          episode.title,
          episode.description,
          episode.episode,
          episodeLabel,
          `episode ${episodeLabel}`,
          `season ${episode.season}`,
          ...episode.tags,
          ...episode.entities,
        ].join(" "));
        return searchText.includes(query);
      })
      .toSorted((a, b) => filters.sort === "newest" ? b.episode - a.episode : a.episode - b.episode);
  }, [deferredQuery, episodes, filters.season, filters.sort, filters.tag]);

  const applyFilters = (next: Filters) => {
    setFilters(next);
    writeFiltersToUrl(next);
  };

  const setFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
    applyFilters({ ...filters, [key]: value });
  };

  const hasFilters = filters.query.trim() || filters.season !== "all" || filters.tag !== "all" || filters.sort !== "newest";

  return (
    <>
      <section className="episode-filters" aria-label="エピソードを検索・絞り込み">
        <div className="episode-search-field">
          <label htmlFor="episode-search">キーワード検索</label>
          <div className="episode-search-input">
            <span aria-hidden="true">⌕</span>
            <input
              id="episode-search"
              type="search"
              value={filters.query}
              onChange={(event) => setFilter("query", event.target.value)}
              placeholder="タイトル・タグ・Episode番号で検索"
            />
          </div>
        </div>
        <label>
          <span>シーズン</span>
          <select value={filters.season} onChange={(event) => setFilter("season", event.target.value)}>
            <option value="all">すべて</option>
            {seasons.map((season) => <option key={season} value={season}>Season {season}</option>)}
          </select>
        </label>
        <label>
          <span>タグ</span>
          <select value={filters.tag} onChange={(event) => setFilter("tag", event.target.value)}>
            <option value="all">すべて</option>
            {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </label>
        <label>
          <span>並び順</span>
          <select value={filters.sort} onChange={(event) => setFilter("sort", event.target.value as Filters["sort"])}>
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
          </select>
        </label>
      </section>

      <div className="episode-results-heading">
        <p aria-live="polite"><strong>{visibleEpisodes.length}</strong> Episodes</p>
        {hasFilters ? (
          <button type="button" onClick={() => applyFilters(defaultFilters)}>条件をクリア</button>
        ) : null}
      </div>

      {visibleEpisodes.length ? (
        <div className="episode-archive-grid">
          {visibleEpisodes.map((episode) => <EpisodeArchiveCard key={episode.slug} episode={episode} />)}
        </div>
      ) : (
        <div className="episode-empty-state">
          <p className="eyebrow">NO EPISODES FOUND</p>
          <h2>条件に合うエピソードが見つかりませんでした。</h2>
          <p>検索語を短くするか、シーズン・タグの条件を変更してみてください。</p>
          <button className="button button-amber" type="button" onClick={() => applyFilters(defaultFilters)}>すべて表示する</button>
        </div>
      )}
    </>
  );
}
