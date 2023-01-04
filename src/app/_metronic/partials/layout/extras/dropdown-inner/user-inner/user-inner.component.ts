import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { AwsService } from 'src/app/modules/auth/services/aws.service';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  currentUserRole:any;
  nameLetter:any={};
  loginedUser:any= JSON.parse(localStorage.getItem('loginedUserDetails') || '{}');
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private awsService:AwsService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    this.getCurrentUserRoleDetails();
    this.getLetters();
  }
  getCurrentUserRoleDetails() {
    if(localStorage.getItem('incorpd-user-details')){
      const currentUserRoleDetails = localStorage.getItem('incorpd-user-details');
      this.currentUserRole = currentUserRoleDetails !== null ? JSON.parse(currentUserRoleDetails).userDetails[0].authority : null;
    }
  }

  logout() {
    this.awsService.onLogout();
    this.auth.logout();

    document.location.reload();
  }
  getLetters(){
    if(this.currentUserRole == 'ENTREPRENEUR'){ 
      // console.log(this.loginedUser.fullName.name,"ghhelooooo")
    this.nameLetter.first = this.loginedUser.fullName.name.substring(0, this.loginedUser.fullName.name.indexOf(' ')); // "72"
    this.nameLetter.second = this.loginedUser.fullName.name.substring(this.loginedUser.fullName.name.indexOf(' ') + 1); // "tocirah sneab"


    // console.log(this.nameLetter,"ghhelooooo")
    }
    

  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
