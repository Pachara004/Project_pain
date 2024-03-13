import { Routes } from '@angular/router';
import { VotemainComponent } from './votemain/votemain.component';
import { LoginComponent } from './login/login.component';
import { RankingComponent } from './ranking/ranking.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './login/signup/signup.component';
import { GraphComponent } from './graph/graph.component';

export const routes: Routes = [
    {path: '',component: VotemainComponent},
    {path: 'login',component: LoginComponent},
    {path: 'login/signup',component: SignupComponent},
    {path: 'ranking',component: RankingComponent},
    {path: 'search',component: SearchComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'graph', component: GraphComponent}
];
