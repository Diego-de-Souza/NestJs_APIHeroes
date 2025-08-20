import { Heroes } from './heroes.model';
import { Studio } from './studio.model';
import { Team } from './equipes.model';
import { User } from './user.model';
import { Role } from './roles.model';
import { Curiosities } from './curiosities.model';
import { Article } from './article.model';
import { Quiz } from './quiz/quiz.model';
import { UserGameProgress } from './games/user-game-progress.model';
import { Games } from './games/games.model';
import { QuizLevel } from './quiz/quiz-level.model';
import { QuizHeroes } from './quiz/quiz-heroes.model';
import { QuizQuestions } from './quiz/quiz-question.model';
import { UserQuizProgress } from './quiz/user-quiz-progress.model';

export { 
  Heroes, 
  Studio, 
  Team, 
  User, 
  Role, 
  Quiz, 
  QuizLevel, 
  QuizHeroes, 
  QuizQuestions, 
  Games, 
  UserGameProgress, 
  UserQuizProgress 
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
  QuizQuestions, 
  Games, 
  UserGameProgress, 
  UserQuizProgress
];

export function defineAssociations() {
  Heroes.belongsTo(Studio, { foreignKey: 'studioId', as: 'studio' });
  Studio.hasMany(Heroes, { foreignKey: 'studioId', as: 'heroisStudio' });

  Heroes.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });
  Team.hasMany(Heroes, { foreignKey: 'team_id', as: 'heroisTeam' });

  User.hasMany(UserGameProgress, { foreignKey: 'user_id', as: 'progress' });
  UserGameProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Games.hasMany(UserGameProgress, { foreignKey: 'game_id', as: 'progress' });
  UserGameProgress.belongsTo(Games, { foreignKey: 'game_id', as: 'game' });

  Quiz.hasMany(QuizLevel, { foreignKey: 'quiz_id', as: 'quiz_levels' });
  QuizLevel.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

  QuizLevel.hasMany(QuizHeroes, { foreignKey: 'quiz_level_id', as: 'quiz_heroes' });
  QuizHeroes.belongsTo(QuizLevel, { foreignKey: 'quiz_level_id', as: 'quiz_level' });

  QuizLevel.hasMany(QuizQuestions, { foreignKey: 'quiz_level_id', as: 'quiz_questions' });
  QuizQuestions.belongsTo(QuizLevel, { foreignKey: 'quiz_level_id', as: 'quiz_level' });

  Quiz.hasMany(UserQuizProgress, { foreignKey: 'quiz_id', as: 'user_quiz_progress' });
  UserQuizProgress.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

  QuizLevel.hasMany(UserQuizProgress, { foreignKey: 'quiz_level_id', as: 'user_quiz_progress_level' });
  UserQuizProgress.belongsTo(QuizLevel, { foreignKey: 'quiz_level_id', as: 'quiz_level' });

  User.hasMany(UserQuizProgress, { foreignKey: 'user_id', as: 'user_quiz_progress_user' });
  UserQuizProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

}
