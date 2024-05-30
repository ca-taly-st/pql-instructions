const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// Return all players that are still available to be drafted by a team
server.get('/api/players/available/', (req, res) => {
  // Get all players
  let players = router.db.get('players').value();
  // Filter out players without a team_id
  let availablePlayers = players.filter(player => player.team_id === null);

  res.jsonp(availablePlayers);
});


/**
 * Customize POST /api/teams so after creating a team, the team_id is added to the players
 * @example
 * 
 * POST /api/teams
 * ```json
 *  {
 *    "name": "Team 1",
 *    "slogan": "Slogan 1",
 *    "players": [1, 2, 3]
 *  }
 * ```
 */
server.post('/api/teams', (req, res) => {
  const { players, ...body } = req.body;

  // Validations
  if (!body.name) {
    return res.status(400).jsonp({ message: 'Name is required' });
  }

  // Snapshot for rollback
  // players
  const originalPlayers = players.map(id => {
    const player = router.db.get('players').find({ id }).value();
    return { ...player };
  });
  // team
  let teamId = router.db.get('teams').value().length + 1;

  try {
    console.log("Creating team...");
    // Create team
    const team = router.db.get('teams').insert({ id: teamId, ...body }).write();
    if(!team) throw new Error('Error creating team');

    console.log("Updating players...");
    if(!players || players.length === 0) throw new Error('Players are required');
    players.forEach(id => {
      // Get player
      const player = router.db.get('players').find({ id }).value();
      if(!player) throw new Error(`Player with id ${id} not found`);

      // Check if player is already in a team
      if(player.team_id) throw new Error(`Player with id ${id} is already in a team`);

      // Update player
      router.db.get('players').find({ id }).assign({ team_id: teamId }).write();
    });

    console.log("Team created successfully");
    res.status(201).jsonp({ message: 'Team created successfully' });
  } catch (error) {
    console.error("Error creating team: ", error);

    // Rollback
    console.log("Rolling back changes...");
    originalPlayers.forEach(player => {
      router.db.get('players').find({ id: player.id }).assign({ team_id: player.team_id }).write();
    });
    // Optionally remove the team if created
    router.db.get('teams').remove({ id: teamId }).write();

    res.status(500).jsonp({ message: error.message });
  }
});


// Use default router
server.use('/api', router);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('JSON Server is running on port ' + PORT);
});