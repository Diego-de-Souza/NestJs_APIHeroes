import { Heroes } from './heroes.model';
import { Studio } from './studio.model';
import { Team } from './equipes.model';
import { User } from './user.model';
import { Role } from './roles.model';
import { Article } from './article.model';
import { Quiz } from './quiz/quiz.model';
import { UserGameProcess } from './games/user-game-progress.model';
import { Games } from './games/games.model';
import { QuizLevel } from './quiz/quiz-level.model';
import { QuizHeroes } from './quiz/quiz-heroes.model';
import { QuizQuestion } from './quiz/quiz-question.model';
import { UserQuizProgress } from './quiz/user-quiz-progress.model';
import { UserSocial } from './user-social.model';
import { Events } from './events.model';
import { Validation } from './validation.model';
import { Subscription } from './subscription.model';
import { Payment } from './payment.model';
import { AccessLog } from './access-log.model';
import { Comment } from './comment.model';
import { CommentLike } from './comment-like.model';
import { News } from './news.model';
import { Notification } from './notification.model';
import { SacContact } from './sac-contact.model';
import { SacResponse } from './sac-response.model';
import { SacAttachment } from './sac-attachment.model';

export { 
  Heroes, 
  Studio, 
  Team, 
  User, 
  Role, 
  Article,
  Quiz, 
  QuizLevel, 
  QuizHeroes, 
  QuizQuestion, 
  Games, 
  UserGameProcess, 
  UserQuizProgress,
  UserSocial,
  Events, 
  Validation,
  Subscription,
  Payment,
  AccessLog,
  Comment,
  CommentLike,
  News,
  Notification,
  SacContact,
  SacResponse,
  SacAttachment
}; 

export const models = [
  Heroes, 
  Studio, 
  Team, 
  User, 
  Role, 
  Article, 
  Quiz,  
  QuizLevel, 
  QuizHeroes, 
  QuizQuestion, 
  Games, 
  UserGameProcess, 
  UserQuizProgress,
  UserSocial,
  Events,
  Validation,
  Subscription,
  Payment,
  AccessLog,
  Comment,
  CommentLike,
  News,
  Notification,
  SacContact,
  SacResponse,
  SacAttachment
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

  // ✅ Payment System Associations
  User.hasMany(Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
  Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
  Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ✅ Access Log Associations
  User.hasMany(AccessLog, { foreignKey: 'user_id', as: 'accessLogs' });
  AccessLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ✅ Comments Associations
  Article.hasMany(Comment, { foreignKey: 'article_id', as: 'comments' });
  Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });
  Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });

  Comment.hasMany(CommentLike, { foreignKey: 'comment_id', as: 'likes' });
  CommentLike.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });

  User.hasMany(CommentLike, { foreignKey: 'user_id', as: 'commentLikes' });
  CommentLike.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ✅ Notifications Associations
  User.hasMany(Notification, { foreignKey: 'usuario_id', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'usuario_id', as: 'user' });

  // ✅ SAC Associations
  User.hasMany(SacContact, { foreignKey: 'usuario_id', as: 'sacContacts' });
  SacContact.belongsTo(User, { foreignKey: 'usuario_id', as: 'user' });

  SacContact.hasMany(SacResponse, { foreignKey: 'contact_id', as: 'responses' });
  SacResponse.belongsTo(SacContact, { foreignKey: 'contact_id', as: 'contact' });

  SacContact.hasMany(SacAttachment, { foreignKey: 'contact_id', as: 'attachments' });
  SacAttachment.belongsTo(SacContact, { foreignKey: 'contact_id', as: 'contact' });

  SacResponse.hasMany(SacAttachment, { foreignKey: 'response_id', as: 'attachments' });
  SacAttachment.belongsTo(SacResponse, { foreignKey: 'response_id', as: 'response' });
}
