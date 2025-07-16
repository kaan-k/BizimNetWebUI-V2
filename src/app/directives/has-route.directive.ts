import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserAuthComponentService } from '../services/component/user/user-auth-component.service';
import { UserComponentService } from '../services/component/user/user-component.service';
import { UserService } from '../services/common/user/user.service';

@Directive({
  selector: '[appHasRouteDirective]',
  standalone: true
})
export class HasRouteDirective {
  @Input() set appHasRouteDirective(code: string) {
    this.checkAccess(code).then((hasAccess) => {
      if (hasAccess) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  private async checkAccess(code: string): Promise<boolean> {
    let userId;
    userId= localStorage.getItem('employeeId');
    if (userId == null) {
      userId = localStorage.getItem('userId');
    } 
    try {
      const response = await this.userService.getUserRoles(code, userId).toPromise();
      return response.success;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  }

  constructor(private templateRef:TemplateRef<any>,private viewContainerRef:ViewContainerRef,private authComponentService:UserAuthComponentService,private userComponentService:UserComponentService,private userService:UserService) { }

}
