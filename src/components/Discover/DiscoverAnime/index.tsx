import Header from '@app/components/Common/Header';
import PageTitle from '@app/components/Common/PageTitle';
import MediaSlider from '@app/components/MediaSlider';
import { useUser } from '@app/hooks/useUser';
import defineMessages from '@app/utils/defineMessages';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

const ANIME_KEYWORD = '210024';
const ANIME_GENRE = '16'; // Animation

// TMDB keyword IDs for adult/mature content to exclude when the 18+ toggle is off
const ADULT_KEYWORDS = '195669,198385,256466,155477,281741'; // ecchi,hentai,erotic,softcore,nudity
const ADULT_TAGS = new Set(['ecchi', 'hentai']); // tag keys hidden when 18+ is off

// Today and date helpers for the release calendar
const today = new Date().toISOString().split('T')[0];
const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000)
  .toISOString()
  .split('T')[0];
const sevenWeeksAhead = new Date(Date.now() + 49 * 86400000)
  .toISOString()
  .split('T')[0];

const ANIME_SUBGENRES = [
  { key: 'action', label: 'Action', params: `keywords=${ANIME_KEYWORD}&genre=28` },
  { key: 'romance', label: 'Romance', params: `keywords=${ANIME_KEYWORD}&genre=10749` },
  { key: 'scifi', label: 'Sci-Fi & Mecha', params: `keywords=${ANIME_KEYWORD}&genre=10765` },
  { key: 'comedy', label: 'Comedy', params: `keywords=${ANIME_KEYWORD}&genre=35` },
  { key: 'horror', label: 'Dark & Horror', params: `keywords=${ANIME_KEYWORD}&genre=9648` },
  { key: 'family', label: 'Family & Kids', params: `keywords=${ANIME_KEYWORD}&genre=10751` },
];

// Tag keyword IDs sourced from TMDB — used alone + animation genre (AND-ing with
// anime keyword 210024 returns 0 results because TMDB tagging is inconsistent)
const ANIME_TAGS = [
  { key: 'isekai', label: '🌀 Isekai', id: '237451' },
  { key: 'slice-of-life', label: '🌸 Slice of Life', id: '9914' },
  { key: 'shounen', label: '⚡ Shounen', id: '207826' },
  { key: 'shoujo', label: '💖 Shoujo', id: '206437' },
  { key: 'mecha', label: '🤖 Mecha', id: '10046' },
  { key: 'harem', label: '🎭 Harem', id: '9194' },
  { key: 'supernatural', label: '👻 Supernatural', id: '6152' },
  { key: 'reincarnation', label: '♻️ Reincarnation', id: '5484' },
  { key: 'psychological', label: '🧠 Psychological', id: '272553' },
  { key: 'demons', label: '😈 Demons', id: '15001' },
  { key: 'dungeon', label: '⚔️ Dungeon', id: '34137' },
  { key: 'vampire', label: '🧛 Vampire', id: '3133' },
  { key: 'magic', label: '✨ Magic', id: '2343' },
  { key: 'school', label: '🏫 School', id: '10873' },
  { key: 'sports', label: '🏆 Sports', id: '6075' },
  { key: 'fantasy', label: '🐉 Fantasy', id: '293198' },
  { key: 'reverse-harem', label: '🔄 Reverse Harem', id: '238374' },
  { key: 'manhwa', label: '🇰🇷 Manhwa', id: '290609' },
  { key: 'post-apoc', label: '☢️ Post-Apocalyptic', id: '359337' },
  { key: 'ecchi', label: '🔞 Ecchi', id: '195669' },
  { key: 'hentai', label: '🔞 Hentai', id: '198385' },
];

const messages = defineMessages('components.Discover.DiscoverAnime', {
  anime: 'Anime',
  trending: 'Trending This Season',
  popular: 'All-Time Favourites',
  youmightlike: 'You Might Like',
  newthisseason: 'New This Season',
  toprated: 'Top Rated',
  browseall: 'Browse All Anime',
  subgenres: 'Browse by Genre',
  browsebytag: 'Browse by Tag',
  tagresults: '{tag}',
  latestrelease: 'Latest Releases',
  comingsoon: 'Coming Soon',
  releasecalendar: 'Release Calendar',
  adulttoggle: '18+',
  adulttoggleoff: 'Mature content hidden',
  adulttoggleton: 'Showing mature content',
});

const DiscoverAnime = () => {
  const intl = useIntl();
  const { user } = useUser();
  const [activeTag, setActiveTag] = useState<(typeof ANIME_TAGS)[0] | null>(
    null
  );
  const [showAdult, setShowAdult] = useState(false);

  // Persist 18+ preference in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('anime-show-adult');
    if (stored === 'true') setShowAdult(true);
  }, []);

  const toggleAdult = () => {
    const next = !showAdult;
    setShowAdult(next);
    localStorage.setItem('anime-show-adult', String(next));
    // Collapse active tag if it's adult-only
    if (!next && activeTag && ADULT_TAGS.has(activeTag.key)) {
      setActiveTag(null);
    }
  };

  const baseAnimeParams = `keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}`;
  const adultFilter = showAdult ? '' : `&excludeKeywords=${ADULT_KEYWORDS}`;
  const base = `${baseAnimeParams}${adultFilter}`;
  // Current season start — Oct 2025; keeps "trending" to what's airing now
  const trendingParams = `${base}&sortBy=popularity.desc&firstAirDateGte=2025-10-01`;
  // All-time favourites by vote count — classics like Naruto, AoT, Demon Slayer
  const popularParams = `${base}&sortBy=vote_count.desc`;
  const topRatedParams = `${base}&sortBy=vote_average.desc&voteCountGte=200`;
  const newThisSeasonParams = `${base}&sortBy=first_air_date.desc`;
  const latestParams = `${base}&sortBy=first_air_date.desc&firstAirDateGte=${sixtyDaysAgo}&firstAirDateLte=${today}`;
  const comingSoonParams = `${base}&sortBy=first_air_date.asc&firstAirDateGte=${today}&firstAirDateLte=${sevenWeeksAhead}`;

  return (
    <>
      <PageTitle title={intl.formatMessage(messages.anime)} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Header>
          <span className="flex items-center gap-2">
            <span>🎌</span>
            {intl.formatMessage(messages.anime)}
          </span>
        </Header>
        <div className="flex items-center gap-3">
          {/* 18+ toggle */}
          <button
            onClick={toggleAdult}
            title={
              showAdult
                ? intl.formatMessage(messages.adulttoggleton)
                : intl.formatMessage(messages.adulttoggleoff)
            }
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
              showAdult
                ? 'border-red-500 bg-red-500/20 text-red-400'
                : 'border-gray-600 bg-gray-800 text-gray-500 hover:border-gray-400 hover:text-gray-300'
            }`}
          >
            <span>{intl.formatMessage(messages.adulttoggle)}</span>
            <span>{showAdult ? '🔓' : '🔒'}</span>
          </button>
          <Link
            href={`/discover/tv?${baseAnimeParams}`}
            className="flex items-center text-sm font-medium text-gray-400 transition hover:text-white"
          >
            {intl.formatMessage(messages.browseall)} →
          </Link>
        </div>
      </div>

      {/* You Might Like */}
      {user && (
        <MediaSlider
          sliderKey="anime-recommendations"
          title={intl.formatMessage(messages.youmightlike)}
          url="/api/v1/discover/anime/recommendations"
          linkUrl={`/discover/tv?${baseAnimeParams}`}
          hideWhenEmpty
        />
      )}

      {/* Trending */}
      <MediaSlider
        sliderKey="anime-trending"
        title={intl.formatMessage(messages.trending)}
        url="/api/v1/discover/tv"
        extraParams={trendingParams}
        linkUrl={`/discover/tv?${trendingParams}`}
      />

      {/* All-Time Favourites */}
      <MediaSlider
        sliderKey="anime-popular"
        title={intl.formatMessage(messages.popular)}
        url="/api/v1/discover/tv"
        extraParams={popularParams}
        linkUrl={`/discover/tv?${popularParams}`}
      />

      {/* New This Season */}
      <MediaSlider
        sliderKey="anime-new"
        title={intl.formatMessage(messages.newthisseason)}
        url="/api/v1/discover/tv"
        extraParams={newThisSeasonParams}
        linkUrl={`/discover/tv?${newThisSeasonParams}`}
      />

      {/* Top Rated */}
      <MediaSlider
        sliderKey="anime-toprated"
        title={intl.formatMessage(messages.toprated)}
        url="/api/v1/discover/tv"
        extraParams={topRatedParams}
        linkUrl={`/discover/tv?${topRatedParams}`}
      />

      {/* ── Release Calendar ── */}
      <div className="mb-4 mt-10 flex items-center gap-3">
        <h2 className="text-xl font-bold text-white">
          📅 {intl.formatMessage(messages.releasecalendar)}
        </h2>
      </div>

      <MediaSlider
        sliderKey="anime-latest"
        title={intl.formatMessage(messages.latestrelease)}
        url="/api/v1/discover/tv"
        extraParams={latestParams}
        linkUrl={`/discover/tv?${latestParams}`}
        hideWhenEmpty
      />

      <MediaSlider
        sliderKey="anime-coming-soon"
        title={intl.formatMessage(messages.comingsoon)}
        url="/api/v1/discover/tv"
        extraParams={comingSoonParams}
        linkUrl={`/discover/tv?${comingSoonParams}`}
        hideWhenEmpty
      />

      {/* ── Browse by Tag ── */}
      <div className="mb-4 mt-10">
        <h2 className="mb-4 text-xl font-bold text-white">
          🏷️ {intl.formatMessage(messages.browsebytag)}
        </h2>
        <div className="flex flex-wrap gap-2">
          {ANIME_TAGS.filter((t) => showAdult || !ADULT_TAGS.has(t.key)).map((tag) => {
            const isActive = activeTag?.key === tag.key;
            return (
              <button
                key={tag.key}
                onClick={() => setActiveTag(isActive ? null : tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag result slider — no adult filter here; deliberate tag selection = intentional browse */}
      {activeTag && (
        <MediaSlider
          key={activeTag.key}
          sliderKey={`anime-tag-${activeTag.key}`}
          title={intl.formatMessage(messages.tagresults, {
            tag: activeTag.label,
          })}
          url="/api/v1/discover/tv"
          extraParams={`keywords=${activeTag.id}&genre=${ANIME_GENRE}`}
          linkUrl={`/discover/tv?keywords=${activeTag.id}&genre=${ANIME_GENRE}`}
        />
      )}

      {/* ── Browse by Genre ── */}
      <div className="mb-4 mt-10">
        <h2 className="text-xl font-bold text-white">
          {intl.formatMessage(messages.subgenres)}
        </h2>
      </div>

      {ANIME_SUBGENRES.map((subgenre) => (
        <MediaSlider
          key={subgenre.key}
          sliderKey={`anime-${subgenre.key}`}
          title={subgenre.label}
          url="/api/v1/discover/tv"
          extraParams={subgenre.params}
          linkUrl={`/discover/tv?${subgenre.params}`}
          hideWhenEmpty
        />
      ))}
    </>
  );
};

export default DiscoverAnime;
