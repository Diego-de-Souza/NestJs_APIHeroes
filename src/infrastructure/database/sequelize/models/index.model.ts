import { Heroes } from './heroes.model';
import { Studio } from './studio.model';
import { Team } from './equipes.model';
import { User } from './user.model';
import { Role } from './roles.model';
import { Curiosities } from './curiosities.model';
import { Article } from './article.model';
import { Quiz } from './quiz.model';
import { UserGameProgress } from './games/user-game-progress.model';
import { Games } from './games/games.model';

export { Heroes, Studio, Team, User, Role, Quiz, Games, UserGameProgress }; 

export const models = [Heroes, Studio, Team, User, Role,Curiosities, Article, Quiz, Games, UserGameProgress]; 

export function defineAssociations() {
  Heroes.belongsTo(Studio, { foreignKey: 'studioId', as: 'studio' });
  Studio.hasMany(Heroes, { foreignKey: 'studioId', as: 'heroisStudio' });

  Heroes.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });
  Team.hasMany(Heroes, { foreignKey: 'team_id', as: 'heroisTeam' });

  User.hasMany(UserGameProgress, { foreignKey: 'user_id', as: 'progress' });
  UserGameProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Games.hasMany(UserGameProgress, { foreignKey: 'game_id', as: 'progress' });
  UserGameProgress.belongsTo(Games, { foreignKey: 'game_id', as: 'game' });
}
