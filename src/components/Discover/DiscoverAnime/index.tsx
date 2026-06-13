import Header from '@app/components/Common/Header';
import PageTitle from '@app/components/Common/PageTitle';
import MediaSlider from '@app/components/MediaSlider';
import { useUser } from '@app/hooks/useUser';
import defineMessages from '@app/utils/defineMessages';
import Link from 'next/link';
import { useState } from 'react';
import { useIntl } from 'react-intl';

// TMDB constants
const ANIME_KEYWORD = '210024';
const ANIME_GENRE = '16'; // Animation

// Anime sub-genre definitions using TMDB genre IDs
const ANIME_SUBGENRES = [
  { key: 'action', label: 'Action', params: `keywords=${ANIME_KEYWORD}&genre=28` },
  { key: 'romance', label: 'Romance', params: `keywords=${ANIME_KEYWORD}&genre=10749` },
  { key: 'scifi', label: 'Sci-Fi & Mecha', params: `keywords=${ANIME_KEYWORD}&genre=10765` },
  { key: 'comedy', label: 'Comedy', params: `keywords=${ANIME_KEYWORD}&genre=35` },
  { key: 'horror', label: 'Dark & Horror', params: `keywords=${ANIME_KEYWORD}&genre=9648` },
  { key: 'family', label: 'Family & Kids', params: `keywords=${ANIME_KEYWORD}&genre=10751` },
];

// Anime tags using TMDB keyword IDs
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
  { key: 'harem-r', label: '🔄 Reverse Harem', id: '238374' },
  { key: 'manhwa', label: '🇰🇷 Manhwa', id: '290609' },
  { key: 'post-apoc', label: '☢️ Post-Apocalyptic', id: '359337' },
];

const messages = defineMessages('components.Discover.DiscoverAnime', {
  anime: 'Anime',
  trending: 'Trending This Week',
  popular: 'Popular Right Now',
  youmightlike: 'You Might Like',
  newthisseason: 'New This Season',
  toprated: 'Top Rated',
  browseall: 'Browse All Anime',
  subgenres: 'Browse by Genre',
  browsebytag: 'Browse by Tag',
  tagresults: '{tag} Anime',
});

const DiscoverAnime = () => {
  const intl = useIntl();
  const { user } = useUser();
  const [activeTag, setActiveTag] = useState<(typeof ANIME_TAGS)[0] | null>(null);

  const baseAnimeParams = `keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}`;
  const trendingParams = `keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}&sortBy=popularity.desc`;
  const topRatedParams = `keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}&sortBy=vote_average.desc&voteCountGte=200`;
  const newThisSeasonParams = `keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}&sortBy=first_air_date.desc`;

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
        <Link
          href={`/discover/tv?keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}`}
          className="flex items-center text-sm font-medium text-gray-400 transition hover:text-white"
        >
          {intl.formatMessage(messages.browseall)} →
        </Link>
      </div>

      {/* You Might Like — personalised from request history */}
      {user && (
        <MediaSlider
          sliderKey="anime-recommendations"
          title={intl.formatMessage(messages.youmightlike)}
          url="/api/v1/discover/anime/recommendations"
          linkUrl={`/discover/tv?keywords=${ANIME_KEYWORD}&genre=${ANIME_GENRE}`}
          hideWhenEmpty
        />
      )}

      {/* Trending This Week */}
      <MediaSlider
        sliderKey="anime-trending"
        title={intl.formatMessage(messages.trending)}
        url="/api/v1/discover/tv"
        extraParams={trendingParams}
        linkUrl={`/discover/tv?${trendingParams}`}
      />

      {/* Popular Right Now */}
      <MediaSlider
        sliderKey="anime-popular"
        title={intl.formatMessage(messages.popular)}
        url="/api/v1/discover/tv"
        extraParams={baseAnimeParams}
        linkUrl={`/discover/tv?${baseAnimeParams}`}
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

      {/* Browse by Tag */}
      <div className="mb-4 mt-10">
        <h2 className="mb-4 text-xl font-bold text-white">
          {intl.formatMessage(messages.browsebytag)}
        </h2>
        <div className="flex flex-wrap gap-2">
          {ANIME_TAGS.map((tag) => {
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

      {/* Tag result slider — shown when a tag is selected */}
      {activeTag && (
        <MediaSlider
          key={activeTag.key}
          sliderKey={`anime-tag-${activeTag.key}`}
          title={intl.formatMessage(messages.tagresults, { tag: activeTag.label })}
          url="/api/v1/discover/tv"
          extraParams={`keywords=${ANIME_KEYWORD},${activeTag.id}&genre=${ANIME_GENRE}`}
          linkUrl={`/discover/tv?keywords=${ANIME_KEYWORD},${activeTag.id}&genre=${ANIME_GENRE}`}
          hideWhenEmpty
        />
      )}

      {/* Sub-genre rows */}
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
