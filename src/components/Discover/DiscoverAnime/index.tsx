import Header from '@app/components/Common/Header';
import PageTitle from '@app/components/Common/PageTitle';
import MediaSlider from '@app/components/MediaSlider';
import { useUser } from '@app/hooks/useUser';
import defineMessages from '@app/utils/defineMessages';
import Link from 'next/link';
import { useIntl } from 'react-intl';

// TMDB constants
const ANIME_KEYWORD = '210024';
const ANIME_GENRE = '16'; // Animation

// Anime sub-genre definitions
// Each combines the anime keyword with a genre or additional keyword
const ANIME_SUBGENRES = [
  {
    key: 'action',
    label: 'Action',
    params: `keywords=${ANIME_KEYWORD}&genre=28`,
  },
  {
    key: 'romance',
    label: 'Romance',
    params: `keywords=${ANIME_KEYWORD}&genre=10749`,
  },
  {
    key: 'scifi',
    label: 'Sci-Fi & Mecha',
    params: `keywords=${ANIME_KEYWORD}&genre=10765`,
  },
  {
    key: 'comedy',
    label: 'Comedy',
    params: `keywords=${ANIME_KEYWORD}&genre=35`,
  },
  {
    key: 'horror',
    label: 'Dark & Horror',
    params: `keywords=${ANIME_KEYWORD}&genre=9648`,
  },
  {
    key: 'family',
    label: 'Family & Kids',
    params: `keywords=${ANIME_KEYWORD}&genre=10751`,
  },
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
  seeall: 'See All',
});

const DiscoverAnime = () => {
  const intl = useIntl();
  const { user } = useUser();

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

      {/* Sub-genre rows */}
      <div className="mb-4 mt-8">
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
