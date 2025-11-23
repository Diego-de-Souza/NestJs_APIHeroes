import { ArticleModule } from "src/interface/modules/articles.Module";
import { AuthModule } from "src/interface/modules/auth.module";
import { CuriositiesModule } from "src/interface/modules/curiosities.module";
import { DadosHeroisModule } from "src/interface/modules/dados-herois.module";
import { GamesModule } from "src/interface/modules/games.module";
import { MenuPrincipalModule } from "src/interface/modules/menu_principal.module";
import { PaymentModule } from "src/interface/modules/payment.module";
import { QuizModule } from "src/interface/modules/quiz.module";
import { StudioModule } from "src/interface/modules/studio.module";
import { TeamModule } from "src/interface/modules/team.module";
import { UserModule } from "src/interface/modules/user.module";

export const appModules = [
  ArticleModule,
  AuthModule,
  CuriositiesModule,
  DadosHeroisModule,
  GamesModule,
  MenuPrincipalModule,
  PaymentModule,
  QuizModule,
  StudioModule,
  TeamModule,
  UserModule,
];