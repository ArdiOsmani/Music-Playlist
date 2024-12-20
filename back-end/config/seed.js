const { User, Genre, Music, Playlist } = require('../models/index');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Clear existing data
    await User.destroy({ where: {} });
    await Genre.destroy({ where: {} });
    await Music.destroy({ where: {} });
    await Playlist.destroy({ where: {} });

    // Create users
    const users = await User.bulkCreate([
      {
        username: 'admin1',
        password: 'admin123', // Will be hashed by hooks
        role: 'admin'
      },
      {
        username: 'artist1',
        password: 'artist123',
        role: 'artist'
      },
      {
        username: 'artist2',
        password: 'artist123',
        role: 'artist'
      },
      {
        username: 'user1',
        password: 'user123',
        role: 'user'
      },
      {
        username: 'user2',
        password: 'user123',
        role: 'user'
      }
    ]);

    // Create genres
    const genres = await Genre.bulkCreate([
      { name: 'Rock' },
      { name: 'Pop' },
      { name: 'Jazz' },
      { name: 'Classical' },
      { name: 'Hip Hop' }
    ]);

    // Create music entries
    const music = await Music.bulkCreate([
      {
        name: 'Sweet Child O Mine',
        youtube_link: 'https://www.youtube.com/watch?v=qoflJn7zkFM&ab_channel=7cloudsRock',
        artist_id: users[1].id, // artist1
        genre_id: genres[0].id, // Rock
        likes: 150
      },
      {
        name: 'Beat It',
        youtube_link: 'https://www.youtube.com/watch?v=8fO8jVZ3T9g&ab_channel=ArtofLofi',
        artist_id: users[1].id, // artist1
        genre_id: genres[1].id, // Pop
        likes: 200
      },
      {
        name: 'Take Five',
        youtube_link: 'https://www.youtube.com/watch?v=vmDDOFXSgAs&ab_channel=buckinny',
        artist_id: users[2].id, // artist2
        genre_id: genres[2].id, // Jazz
        likes: 75
      },
      {
        name: 'Moonlight Sonata',
        youtube_link: 'https://www.youtube.com/watch?v=4Tr0otuiQuU&ab_channel=andrearomano',
        artist_id: users[2].id, // artist2
        genre_id: genres[3].id, // Classical
        likes: 100
      }
    ]);

    // Create playlists
    await Playlist.bulkCreate([
      {
        user_id: users[3].id, // user1
        music_id: music[0].id
      },
      {
        user_id: users[3].id, // user1
        music_id: music[1].id
      },
      {
        user_id: users[4].id, // user2
        music_id: music[2].id
      },
      {
        user_id: users[4].id, // user2
        music_id: music[3].id
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Export the seeding function
module.exports = seedDatabase;