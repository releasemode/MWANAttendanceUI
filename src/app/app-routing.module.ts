import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { UserauthguardGuard } from './userauthguard.guard';
const routes: Routes = [
  { path: '', redirectTo: 'attendance' },
  { path: 'attendance', component: AttendanceComponent,canActivate:[UserauthguardGuard] },
  { path: 'reports',component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
