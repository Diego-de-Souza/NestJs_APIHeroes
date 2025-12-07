import { Heroes } from 'src/infrastructure/database/sequelize/models/heroes.model';
import { Studio } from 'src/infrastructure/database/sequelize/models/studio.model';
import { Team } from 'src/infrastructure/database/sequelize/models/equipes.model';
import { User } from 'src/infrastructure/database/sequelize/models/user.model';
import { Role } from 'src/infrastructure/database/sequelize/models/roles.model';
import { Curiosities } from 'src/infrastructure/database/sequelize/models/curiosities.model';
import { Article } from 'src/infrastructure/database/sequelize/models/article.model';
import { Quiz } from 'src/infrastructure/database/sequelize/models/quiz/quiz.model';
import { UserGameProcess } from 'src/infrastructure/database/sequelize/models/games/user-game-progress.model';
import { Games } from 'src/infrastructure/database/sequelize/models/games/games.model';
import { QuizLevel } from 'src/infrastructure/database/sequelize/models/quiz/quiz-level.model';
import { QuizHeroes } from 'src/infrastructure/database/sequelize/models/quiz/quiz-heroes.model';
import { QuizQuestion } from 'src/infrastructure/database/sequelize/models/quiz/quiz-question.model';
import { UserQuizProgress } from 'src/infrastructure/database/sequelize/models/quiz/user-quiz-progress.model';
import { UserSocial } from 'src/infrastructure/database/sequelize/models/user-social.model';
import { Events } from './events.model';

export { 
  Heroes, 
  Studio, 
  Team, 
  User, 
  Role, 
  Quiz, 
  QuizLevel, 
  QuizHeroes, 
  QuizQuestion, 
  Games, 
  UserGameProcess, 
  UserQuizProgress,
  UserSocial,
  Events
}; 

export const models = [
  Heroes, 
  Studio, 
  Team, 
  User, 
  Role, 
  Curiosities, 
  Article, 
  Quiz,  
  QuizLevel, 
  QuizHeroes, 
  QuizQuestion, 
  Games, 
  UserGameProcess, 
  UserQuizProgress,
  UserSocial,
  Events
];

export function defineAssociations() {
  Heroes.belongsTo(Studio, { foreignKey: 'studioId', as: 'studio' });
  Studio.hasMany(Heroes, { foreignKey: 'studioId', as: 'HeroesisStudio' });

  Heroes.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });
  Team.hasMany(Heroes, { foreignKey: 'team_id', as: 'HeroesisTeam' });

  User.hasMany(UserGameProcess, { foreignKey: 'user_id', as: 'progress' });
  UserGameProcess.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Games.hasMany(UserGameProcess, { foreignKey: 'game_id', as: 'progress' });
  UserGameProcess.belongsTo(Games, { foreignKey: 'game_id', as: 'game' });

  Quiz.hasMany(QuizLevel, { foreignKey: 'quiz_id', as: 'quiz_levels' });
  QuizLevel.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

  QuizLevel.hasMany(QuizHeroes, { foreignKey: 'quiz_level_id', as: 'quiz_Heroeses' });
  QuizHeroes.belongsTo(QuizLevel, { foreignKey: 'quiz_level_id', as: 'quiz_level' });

  QuizLevel.hasMany(QuizQuestion, { foreignKey: 'quiz_level_id', as: 'quiz_questions' });
  QuizQuestion.belongsTo(QuizLevel, { foreignKey: 'quiz_level_id', as: 'quiz_level' });

  Quiz.hasMany(UserQuizProgress, { foreignKey: 'quiz_id', as: 'user_quiz_progress' });
  UserQuizProgress.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

  QuizLevel.hasMany(UserQuizProgress, { foreignKey: 'quiz_level_id', as: 'user_quiz_progress_level' });
  UserQuizProgress.belongsTo(QuizLevel, { foreignKey: 'quiz_level_id', as: 'quiz_level' });

  User.hasMany(UserQuizProgress, { foreignKey: 'user_id', as: 'user_quiz_progress_user' });
  UserQuizProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasMany(UserSocial, {foreignKey: 'user_id', as: 'user_social'})
  UserSocial.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
}
